import mongoose from 'mongoose';

const MonthlyLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  monthIndex: { type: Number, required: true },
  monthName: { type: String, required: true },
  statsSnapshot: [
    {
      label: String,
      value: Number, // current value
      delta: Number  // change from previous month (can be positive or negative)
    }
  ],
  tasksCompleted: { type: Number, default: 0 },
  totalTasks: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const MonthlyLog = mongoose.model('MonthlyLog', MonthlyLogSchema);
