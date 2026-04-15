const express = require('express');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');
const { getRecommendations } = require('../utils/recommendationEngine');

const router = express.Router();

// @route   GET /api/recommendations
// @desc    Get AI-powered event recommendations for the logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = req.user;

    if (!user.quizCompleted || !user.personalityProfile) {
      return res.status(400).json({
        success: false,
        message: 'Please complete the personality quiz to get recommendations.',
        quizRequired: true,
      });
    }

    // Fetch upcoming events (future events only)
    const events = await Event.find({ date: { $gte: new Date() } }).limit(100);

    const recommendations = getRecommendations(events, user.personalityProfile, 20);

    res.json({
      success: true,
      recommendations,
      profile: user.personalityProfile,
      totalMatched: recommendations.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error generating recommendations.' });
  }
});

module.exports = router;
