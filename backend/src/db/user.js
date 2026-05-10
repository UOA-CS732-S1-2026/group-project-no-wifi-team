import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  achievements: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
