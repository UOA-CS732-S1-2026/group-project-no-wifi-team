import mongoose from 'mongoose';

const QuarterlyLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quarterIndex: { type: Number, required: true },
  quarterName: { type: String, required: true },
  statsSnapshot: [
    {
      label: String,
      value: Number, // current value
      delta: Number  // change from previous quarter (can be positive or negative)
    }
  ],
  tasksCompleted: { type: Number, default: 0 },
  totalTasks: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

QuarterlyLogSchema.index({ userId: 1, quarterIndex: 1 }, { unique: true });

export const QuarterlyLog = mongoose.model('QuarterlyLog', QuarterlyLogSchema);
