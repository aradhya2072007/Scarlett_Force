const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const personalityProfileSchema = new mongoose.Schema({
  social: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  creative: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  tech: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  outdoor: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  analytical: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  energetic: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  budget: { type: String, enum: ['free', 'paid', 'any'], default: 'any' },
  preferredDays: { type: [String], default: ['weekend'] },
  interests: { type: [String], default: [] },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  avatar: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    maxlength: [300, 'Bio cannot exceed 300 characters'],
    default: '',
  },
  personalityProfile: {
    type: personalityProfileSchema,
    default: null,
  },
  quizCompleted: {
    type: Boolean,
    default: false,
  },
  savedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
