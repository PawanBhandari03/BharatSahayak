const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send a WhatsApp template message via Twilio Sandbox
 * @param {string} to - Recipient phone number e.g. '+917057167045'
 * @param {Object} variables - Template variables e.g. { "1": "12/1", "2": "3pm" }
 */
async function sendWhatsAppTemplate(to, variables = {}) {
  const message = await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,        // whatsapp:+14155238886
    to: `whatsapp:${to}`,
    contentSid: process.env.TWILIO_TEMPLATE_SID,   // HXb5b...
    contentVariables: JSON.stringify(variables),
  });

  console.log(`[Twilio] Message sent. SID: ${message.sid}`);
  return message.sid;
}

/**
 * Send a plain WhatsApp text message
 * @param {string} to - Recipient phone number e.g. '+917057167045'
 * @param {string} body - Message text
 */
async function sendWhatsAppText(to, body) {
  const message = await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${to}`,
    body,
  });

  console.log(`[Twilio] Message sent. SID: ${message.sid}`);
  return message.sid;
}

module.exports = { sendWhatsAppTemplate, sendWhatsAppText };
