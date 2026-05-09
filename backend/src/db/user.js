import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, default: () => randomUUID() },
  username: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
