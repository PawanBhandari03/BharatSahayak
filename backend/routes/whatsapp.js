const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const { sendWhatsAppTemplate, sendWhatsAppText } = require('../services/twilioService');
const { SYSTEM_PROMPT } = require('../prompts/systemPrompt');

// ─── MISTRAL AI SETUP ─────────────────────────────────────────────────────────
const { Mistral } = require('@mistralai/mistralai');
const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

// ─── CONVERSATION MEMORY (simple in-memory store) ────────────────────────────
const userSessions = {};

// ─── OUTBOUND: Send WhatsApp Template ────────────────────────────────────────
router.post('/send-template', async (req, res) => {
  const { to, variables } = req.body;
  if (!to) return res.status(400).json({ error: '"to" is required' });

  try {
    const sid = await sendWhatsAppTemplate(to, variables || {});
    res.json({ success: true, sid });
  } catch (err) {
    console.error('[Twilio Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── OUTBOUND: Send Plain Text ────────────────────────────────────────────────
router.post('/send-text', async (req, res) => {
  const { to, message } = req.body;
  if (!to || !message)
    return res.status(400).json({ error: '"to" and "message" are required' });

  try {
    const sid = await sendWhatsAppText(to, message);
    res.json({ success: true, sid });
  } catch (err) {
    console.error('[Twilio Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── INBOUND WEBHOOK: Twilio → Your Server ───────────────────────────────────
router.post('/webhook', async (req, res) => {
  const from = req.body.From;
  const userMessage = req.body.Body?.trim();

  // Handle empty or status callbacks
  if (!userMessage) {
    if (req.body.MessageStatus) {
      console.log(`[Status] ${req.body.To} → ${req.body.MessageStatus}`);
    }
    res.set('Content-Type', 'text/xml');
    return res.send(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`);
  }

  console.log(`[Webhook] From: ${from} | Message: "${userMessage}"`);

  // ── Initialize session for this user ──────────────────────────────────────
  if (!userSessions[from]) {
    userSessions[from] = {
      messages: [],
      profile: {},
      queue: [],
      processing: false
    };
  }

  const session = userSessions[from];

  // Respond to Twilio immediately to prevent 15-second gateway timeout
  res.set('Content-Type', 'text/xml');
  res.send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');

  // Add incoming message to queue
  session.queue.push(userMessage);

  // Sequentially process the message queue for this user
  const processQueue = async () => {
    if (session.processing || session.queue.length === 0) return;

    session.processing = true;
    const currentMessage = session.queue.shift();

    // Add user message to history
    session.messages.push({
      role: 'user',
      content: currentMessage
    });

    // Keep only last 10 messages to avoid token overflow
    if (session.messages.length > 10) {
      session.messages = session.messages.slice(-10);
    }

    try {
      const response = await mistral.chat.complete({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          ...session.messages
        ]
      });

      const aiReply = response.choices[0].message.content;
      console.log(`[AI Reply] ${aiReply}`);

      session.messages.push({
        role: 'assistant',
        content: aiReply
      });

      const recipientNumber = from.replace('whatsapp:', '').trim().replace(/\s+/g, '+');
      await sendWhatsAppText(recipientNumber, aiReply);

    } catch (error) {
      console.error('[Mistral Error]', error.message);
      try {
        const recipientNumber = from.replace('whatsapp:', '').trim().replace(/\s+/g, '+');
        await sendWhatsAppText(recipientNumber, 'Maafi chahte hain. Thodi der baad try karein. 🙏\n\nReply HELLO to start again.');
      } catch (twilioErr) {
        console.error('[Twilio Error on Fail Reply]', twilioErr.message);
      }
    } finally {
      session.processing = false;
      // Process next message in the queue
      processQueue();
    }
  };

  // Trigger queue processing
  processQueue();
});

module.exports = router;