// routes/recommendations.js
const express = require('express');
const recommendationController = require('../controllers/recommendationController');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /recommendations/:userId
router.get('/recommendations/:userId', isAuth, recommendationController.getRecommendations);

module.exports = router;
