const axios = require('axios');

const payload = {
  name: "Savitribai Patil Test",
  age: 52,
  gender: "Female",
  state: "Maharashtra",
  occupation: "Farmer / Kisan",
  maritalStatus: "Widow / Widower",
  hasLand: "Yes",
  annualIncome: 48000,
  hasBPL: "Yes",
  income: "Up to ₹50,000/year",
  mobile: "7057167045",
  pin: "1234"
};

async function run() {
  try {
    console.log('Sending request to /api/match-schemes...');
    const res = await axios.post('http://localhost:5000/api/match-schemes', payload);
    console.log('Response status:', res.status);
    console.log('Response data length:', res.data.length);
  } catch (err) {
    console.error('Request failed:', err.response?.data || err.message);
  }
}

run();
