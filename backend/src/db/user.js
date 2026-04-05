import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  guestId: { type: String, unique: true, sparse: true },
  googleId: { type: String, unique: true, sparse: true },
  email: String,
  displayName: String,
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
