const express = require('express');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/registrations/:eventId
// @desc    RSVP to an event
// @access  Private
router.post('/:eventId', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

    // Check capacity
    if (event.rsvpCount >= event.capacity) {
      // Waitlist
      const reg = await Registration.create({
        user: req.user._id,
        event: req.params.eventId,
        status: 'waitlisted',
      });
      return res.status(201).json({ success: true, registration: reg, waitlisted: true });
    }

    const registration = await Registration.create({
      user: req.user._id,
      event: req.params.eventId,
      status: 'confirmed',
    });

    // Increment RSVP count
    await Event.findByIdAndUpdate(req.params.eventId, { $inc: { rsvpCount: 1 } });

    res.status(201).json({ success: true, registration, waitlisted: false });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already registered for this event.' });
    }
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during RSVP.' });
  }
});

// @route   DELETE /api/registrations/:eventId
// @desc    Cancel registration for an event
// @access  Private
router.delete('/:eventId', protect, async (req, res) => {
  try {
    const registration = await Registration.findOneAndDelete({
      user: req.user._id,
      event: req.params.eventId,
    });

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found.' });
    }

    if (registration.status === 'confirmed') {
      await Event.findByIdAndUpdate(req.params.eventId, { $inc: { rsvpCount: -1 } });
    }

    res.json({ success: true, message: 'Registration cancelled successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error cancelling registration.' });
  }
});

// @route   GET /api/registrations/my
// @desc    Get all registrations for the current user
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('event', 'title date image category location price tags')
      .sort({ createdAt: -1 });

    res.json({ success: true, registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route   GET /api/registrations/check/:eventId
// @desc    Check if user is registered for an event
// @access  Private
router.get('/check/:eventId', protect, async (req, res) => {
  try {
    const registration = await Registration.findOne({
      user: req.user._id,
      event: req.params.eventId,
    });
    res.json({ success: true, isRegistered: !!registration, registration });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
