import mongoose from 'mongoose';
import { User } from '../db/user.js';
import { MonthlyLog } from '../db/monthlyLog.js';

async function seed() {
  try {
    // clean up existing data
    await User.deleteMany({});
    await MonthlyLog.deleteMany({});

    const mockUser = await User.create({
      guestId: 'guest_mock_123456',
      displayName: 'Test Player'
    });
    console.log('Mock user created:', mockUser.guestId);

    const mockLogs = [
      {
        userId: mockUser._id,
        monthIndex: 9,
        monthName: 'September',
        statsSnapshot: [
          { label: 'Intelligence', value: 70, delta: 10 },
          { label: 'Health', value: 80, delta: 5 },
          { label: 'Wealth', value: 500, delta: 200 }
        ],
        tasksCompleted: 4,
        totalTasks: 5,
        totalScore: 1200
      },
      {
        userId: mockUser._id,
        monthIndex: 10,
        monthName: 'October',
        statsSnapshot: [
          { label: 'Intelligence', value: 85, delta: 15 },
          { label: 'Health', value: 75, delta: -5 },
          { label: 'Wealth', value: 1200, delta: 700 }
        ],
        tasksCompleted: 8,
        totalTasks: 10,
        totalScore: 2500
      }
    ];

    await MonthlyLog.insertMany(mockLogs);
    console.log('Mock logs inserted successfully!');

    console.log('\n--- SEEDING COMPLETE ---');
    console.log('You can now use "guest_mock_123456" as x-user-id in your headers.');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

export default seed();