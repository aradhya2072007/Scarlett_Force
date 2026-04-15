const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters'],
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  category: {
    type: String,
    required: true,
    enum: ['tech', 'music', 'sports', 'art', 'networking', 'food', 'education', 'adventure', 'wellness', 'gaming', 'science', 'film'],
  },
  tags: {
    type: [String],
    default: [],
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
  },
  endDate: {
    type: Date,
  },
  location: {
    city: { type: String, required: true },
    address: { type: String, default: '' },
    venue: { type: String, default: '' },
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    isOnline: { type: Boolean, default: false },
  },
  price: {
    type: Number,
    default: 0, // 0 = free
  },
  currency: {
    type: String,
    default: 'USD',
  },
  image: {
    type: String,
    default: '',
  },
  organizer: {
    name: { type: String, required: true },
    email: { type: String, default: '' },
  },
  capacity: {
    type: Number,
    default: 100,
  },
  rsvpCount: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, { timestamps: true });

// Separate indexes for search and filtering
eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ category: 1 });
eventSchema.index({ tags: 1 });

module.exports = mongoose.model('Event', eventSchema);
