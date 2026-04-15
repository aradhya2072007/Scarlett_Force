const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { computePersonalityFromQuiz } = require('../utils/recommendationEngine');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedEvents', 'title date image category location price');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route   POST /api/users/personality
// @desc    Save personality quiz results
// @access  Private
router.post('/personality', protect, async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Please provide quiz answers array.' });
    }

    const personalityProfile = computePersonalityFromQuiz(answers);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { personalityProfile, quizCompleted: true },
      { new: true }
    );

    res.json({ success: true, personalityProfile, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error saving personality.' });
  }
});

// @route   POST /api/users/save-event/:eventId
// @desc    Save or unsave an event
// @access  Private
router.post('/save-event/:eventId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const eventId = req.params.eventId;
    const isSaved = user.savedEvents.includes(eventId);

    if (isSaved) {
      user.savedEvents = user.savedEvents.filter((id) => id.toString() !== eventId);
    } else {
      user.savedEvents.push(eventId);
    }

    await user.save();
    res.json({ success: true, saved: !isSaved, savedEvents: user.savedEvents });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
