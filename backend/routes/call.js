const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const { Mistral } = require('@mistralai/mistralai');

const mistral = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY
});

// User calls → AI greets
router.post('/incoming', (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();

    twiml.say({
        language: 'hi-IN',
        voice: 'Google.hi-IN-Standard-D'
    },
        'Namaste! BharatSahayak mein aapka swagat hai. ' +
        'Main aapki sarkari yojanaon mein madad karunga. ' +
        'Beep ke baad apna naam, umar, rajya aur kaam batayein.'
    );

    twiml.record({
        action: '/api/call/process',
        method: 'POST',
        maxLength: 30,
        playBeep: true,
        trim: 'trim-silence'
    });

    res.type('text/xml');
    res.send(twiml.toString());
});

// Process recording → Find schemes
router.post('/process', async (req, res) => {
    const from = req.body.From;
    const twiml = new twilio.twiml.VoiceResponse();

    try {
        twiml.say({
            language: 'hi-IN',
            voice: 'Google.hi-IN-Standard-D'
        },
            'Ek moment. Main aapke liye schemes dhundh raha hoon.'
        );

        const response = await mistral.chat.complete({
            model: 'mistral-large-latest',
            messages: [
                {
                    role: 'system',
                    content: `You are BharatSahayak voice AI.
          Find top 3 Indian government schemes.
          Reply ONLY in simple Hindi.
          Under 80 words for voice.
          Say scheme name and amount clearly.
          End with: WhatsApp par list ke liye 
          1 dabayein.`
                },
                {
                    role: 'user',
                    content: `Caller from ${from} wants government schemes. 
          Give top 3 schemes in Hindi with amounts.`
                }
            ]
        });

        const aiReply = response.choices[0].message.content;
        console.log(`[Call Reply] ${aiReply}`);

        twiml.say({
            language: 'hi-IN',
            voice: 'Google.hi-IN-Standard-D'
        }, aiReply);

        const gather = twiml.gather({
            action: `/api/call/keypress?from=${from}`,
            method: 'POST',
            numDigits: 1,
            timeout: 8
        });

        gather.say({
            language: 'hi-IN',
            voice: 'Google.hi-IN-Standard-D'
        },
            'WhatsApp par poori list ke liye 1 dabayein. ' +
            'Dobara sunne ke liye 2 dabayein.'
        );

    } catch (error) {
        console.error('[Call Error]', error.message);
        twiml.say({
            language: 'hi-IN'
        },
            'Maafi chahte hain. Kuch gadbad ho gayi. Phir se call karein.'
        );
    }

    res.type('text/xml');
    res.send(twiml.toString());
});

// Handle keypress
router.post('/keypress', async (req, res) => {
    const digit = req.body.Digits;
    const from = req.query.from;
    const twiml = new twilio.twiml.VoiceResponse();

    if (digit === '1') {
        try {
            const client = require('twilio')(
                process.env.TWILIO_ACCOUNT_SID,
                process.env.TWILIO_AUTH_TOKEN
            );

            await client.messages.create({
                from: process.env.TWILIO_WHATSAPP_FROM,
                to: `whatsapp:${from}`,
                body: `🇮🇳 *BharatSahayak — Aapki Schemes*\n\n` +
                    `✅ PM-KISAN — ₹6,000/saal\n` +
                    `✅ Ayushman Bharat — ₹5L health cover\n` +
                    `✅ PMKVY — ₹8,000 skill training\n` +
                    `✅ Mudra Loan — ₹10L tak\n` +
                    `✅ PM Awas Yojana — ₹2.5L housing\n\n` +
                    `🌐 https://bharatsahayak.vercel.app\n\n` +
                    `Apni details bhejein personalized list ke liye!`
            });

            twiml.say({
                language: 'hi-IN',
                voice: 'Google.hi-IN-Standard-D'
            },
                'Aapke WhatsApp par list bhej di gayi. ' +
                'Dhanyavaad. Jai Hind!'
            );

        } catch (err) {
            console.error('[WhatsApp Error]', err.message);
            twiml.say({
                language: 'hi-IN'
            },
                'WhatsApp message mein dikkat aayi. Maafi chahte hain.'
            );
        }

    } else if (digit === '2') {
        twiml.redirect('/api/call/incoming');

    } else {
        twiml.say({
            language: 'hi-IN',
            voice: 'Google.hi-IN-Standard-D'
        },
            'Dhanyavaad. Jai Hind!'
        );
    }

    res.type('text/xml');
    res.send(twiml.toString());
});

module.exports = router;