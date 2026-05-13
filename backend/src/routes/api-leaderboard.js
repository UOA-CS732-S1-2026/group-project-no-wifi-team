import { Router } from 'express';
import { UserStats } from '../db/userStats.js';
import { User } from '../db/user.js';
import { authOptional } from '../middleware/auth.js';

const router = Router();

// GET /leaderboard?limit=10
router.get('/', authOptional, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    // Aggregate: sort by achievement count desc, then ending count desc
    const allStats = await UserStats.aggregate([
      {
        $addFields: {
          achievementCount: { $size: { $ifNull: ['$achievements', []] } },
          endingCount: { $size: { $ifNull: ['$endings', []] } },
        },
      },
      { $sort: { achievementCount: -1, endingCount: -1 } },
    ]);

    // Resolve usernames
    const userIds = allStats.map((s) => s.userId);
    const users = await User.find({ userId: { $in: userIds }, isDeleted: { $ne: true } }).lean();
    const userMap = new Map(users.map((u) => [u.userId, u.username]));

    const leaderboard = allStats.slice(0, limit).map((s, i) => ({
      rank: i + 1,
      userId: s.userId,
      username: userMap.get(s.userId) ?? 'Unknown',
      achievementCount: s.achievementCount,
      endingCount: s.endingCount,
    }));

    let currentUser = null;
    if (req.userId) {
      const rank = allStats.findIndex((s) => s.userId === req.userId);
      if (rank !== -1) {
        const s = allStats[rank];
        currentUser = {
          rank: rank + 1,
          userId: s.userId,
          username: userMap.get(s.userId) ?? req.username ?? 'Unknown',
          achievementCount: s.achievementCount,
          endingCount: s.endingCount,
        };
      }
    }

    res.json({ leaderboard, currentUser });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;
