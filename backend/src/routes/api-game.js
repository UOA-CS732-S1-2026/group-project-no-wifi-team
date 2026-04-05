import { Router } from "express";
import { MonthlyLog } from "../db/monthlyLog.js";
import { User } from "../db/user.js";

const router = Router();

/**
 * GET /api/game/monthly-summary
 */
router.get("/monthly-summary", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ error: "Missing userId" });

    let user = await User.findOne({ guestId: userId });
    if (!user) {
      return res.status(404).json({ error: "No user found with this id" });
    }

    const summary = await MonthlyLog.findOne({ userId: user._id }).sort({ createdAt: -1 });

    if (!summary) {
      return res.status(404).json({ error: "No summary found for this user" });
    }

    return res.json({
      monthName: summary.monthName,
      monthIndex: summary.monthIndex,
      stats: summary.statsSnapshot,
      tasksCompleted: summary.tasksCompleted,
      totalTasks: summary.totalTasks,
      totalScore: summary.totalScore,
      monthsToGraduation: 12 - summary.monthIndex
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/game/:dexNumber
 *
 * Returns detailed information
 */
router.get("/:dexNumber", async (req, res) => {
  try {
    const dexNumber = parseInt(req.params.dexNumber);

    if (isNaN(dexNumber)) {
      return res.status(400).json({ error: "Invalid dex number" });
    }

    // const game = await game.findOne({ dexNumber });
    // if (!game) {
    //   return res.status(404).json({ error: `dex number ${dexNumber} not found` });
    // }
    return res.json(species);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
