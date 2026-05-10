import { Router } from 'express';
import { User } from '../db/user.js';

const router = Router();

// Find or create a user by username
router.post('/login', async (req, res) => {
  const { username } = req.body;
  if (!username || typeof username !== 'string' || !username.trim()) {
    return res.status(400).json({ error: 'username is required' });
  }
  const name = username.trim();
  let user = await User.findOne({ username: name });
  if (!user) {
    user = await User.create({ username: name });
  }
  res.json({ username: user.username, achievements: user.achievements ?? [] });
});

// Add an achievement to a user (idempotent)
router.post('/achievement', async (req, res) => {
  const { username, achievementKey } = req.body;
  if (!username || !achievementKey) {
    return res.status(400).json({ error: 'username and achievementKey are required' });
  }
  const user = await User.findOneAndUpdate(
    { username },
    { $addToSet: { achievements: achievementKey } },
    { new: true }
  );
  if (!user) return res.status(404).json({ error: 'user not found' });
  res.json({ achievements: user.achievements });
});

// Get all achievements for a user
router.get('/achievements/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json({ error: 'user not found' });
  res.json({ achievements: user.achievements });
});

export default router;
