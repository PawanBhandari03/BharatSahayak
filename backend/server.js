require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const schemeRoutes = require('./routes/schemeRoutes');
app.use('/api', schemeRoutes);

// Health endpoint
app.get('/', (req, res) => {
  res.json({
    message: "BharatSahayak API Running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
