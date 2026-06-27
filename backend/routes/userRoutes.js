const express = require('express');
const router = express.Router();
const { registerUser, getUserProfile, verifyPin } = require('../controllers/userController');

// Register new user profile (saves to Supabase)
router.post('/register', registerUser);

// Get user profile by mobile
router.get('/profile/:mobile', getUserProfile);

// Verify 4-digit PIN for login
router.post('/verify-pin', verifyPin);

module.exports = router;
