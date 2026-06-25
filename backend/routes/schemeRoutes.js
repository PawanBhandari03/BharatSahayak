const express = require('express');
const router = express.Router();
const { matchSchemes, aiRecommend } = require('../controllers/schemeController');

router.post('/match-schemes', matchSchemes);
router.post('/ai-recommend', aiRecommend);

module.exports = router;
