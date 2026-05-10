import mongoose from 'mongoose';

const userStatsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  totalPlays: { type: Number, default: 0 },
  achievements: { type: [String], default: [] },
  endings: { type: [String], default: [] },
}, {
  timestamps: true,
});

export const UserStats = mongoose.model('UserStats', userStatsSchema);
