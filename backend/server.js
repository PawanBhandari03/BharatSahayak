require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/whatsapp', require('./routes/whatsapp'));
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
