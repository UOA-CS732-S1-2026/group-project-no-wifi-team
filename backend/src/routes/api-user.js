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
  res.json({ username: user.username, userId: user.userId });
});

export default router;
