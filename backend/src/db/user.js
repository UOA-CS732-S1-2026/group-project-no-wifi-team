import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, default: () => randomUUID() },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
}, {
  timestamps: true,
});

export const User = mongoose.model('User', userSchema);
