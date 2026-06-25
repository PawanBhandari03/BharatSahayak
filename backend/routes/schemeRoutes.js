const express = require('express');
const router = express.Router();
const { matchSchemes } = require('../controllers/schemeController');

router.post('/match-schemes', matchSchemes);

module.exports = router;
