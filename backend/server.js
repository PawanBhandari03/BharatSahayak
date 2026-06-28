require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'https://bharat-sahayak-one.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || (typeof origin === 'string' && origin.endsWith('.vercel.app'))) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/whatsapp', require('./routes/whatsapp'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api', require('./routes/schemes'));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'BharatSahayak Backend running ✅', port: PORT });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

const https = require('https');
setInterval(() => {
  https.get('https://bharatsahayak.onrender.com', (res) => {
    console.log(`[Keep-alive] Server pinged. Status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.log(`[Keep-alive] Ping failed: ${err.message}`);
  });
}, 14 * 60 * 1000);
