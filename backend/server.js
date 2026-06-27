require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
const schemeRoutes = require('./routes/schemeRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/api', schemeRoutes);
app.use('/api/users', userRoutes);

// Health endpoint
app.get('/', (req, res) => {
  res.json({
    message: "BharatSahayak API Running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`   AI (Mistral):    ${process.env.MISTRAL_API_KEY ? '✅ configured' : '❌ missing MISTRAL_API_KEY'}`);
  console.log(`   DB (Supabase):   ${process.env.SUPABASE_URL ? '✅ configured' : '❌ missing SUPABASE_URL'}`);
  console.log('');
});
