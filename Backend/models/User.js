import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password in queries by default
    },
    // ── Matchmaking Fields ──────────────────────────────────────────────────
    isSearching: {
      type: Boolean,
      default: false,
    },
    currentRoomId: {
      type: String,
      default: null,
    },
    isInCall: {
      type: Boolean,
      default: false,
    },
    // ── Profile Fields ──────────────────────────────────────────────────────
    nativeLanguage: {
      type: String,
      default: 'Not specified',
    },
    learningLanguage: {
      type: String,
      default: 'Not specified',
    },
    totalCalls: {
      type: Number,
      default: 0,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ── Hash password before saving ─────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: Compare password ───────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Instance method: Get public profile ─────────────────────────────────────
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    nativeLanguage: this.nativeLanguage,
    learningLanguage: this.learningLanguage,
    totalCalls: this.totalCalls,
    isSearching: this.isSearching,
    isInCall: this.isInCall,
    createdAt: this.createdAt,
  };
};

const User = mongoose.model('User', userSchema);
export default User;
