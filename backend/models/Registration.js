const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  status: {
    type: String,
    enum: ['confirmed', 'waitlisted', 'cancelled'],
    default: 'confirmed',
  },
  ticketCode: {
    type: String,
    unique: true,
    sparse: true,
  },
}, { timestamps: true });

// Prevent duplicate registrations
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

// Generate ticket code before saving
registrationSchema.pre('save', function () {
  if (!this.ticketCode) {
    this.ticketCode = `ES-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
});

module.exports = mongoose.model('Registration', registrationSchema);
