const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['student', 'professional'], default: 'student' },
  careerInterest: { type: String, default: '' },
  skillLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  isAdmin: { type: Boolean, default: false },
  isPro: { type: Boolean, default: false },
  stripeCustomerId: { type: String },
  avatar: { type: String },
  bio: { type: String },
  skills: [{ type: String }],
  resumeUrl: { type: String },
  lastActive: { type: Date, default: Date.now },
  loginCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
