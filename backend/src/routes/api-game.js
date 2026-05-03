import { Router } from "express";
import { QuarterlyLog } from "../db/quarterlyLog.js";
import { User } from "../db/user.js";
import { applyTaskChoice, baseTaskState, buildTaskResponse } from "../data/taskData.js";

const router = Router();

/**
 * GET /api/game/quarterly-summary
 */
router.get("/quarterly-summary", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ error: "Missing userId" });

    let user = await User.findOne({ guestId: userId });
    if (!user) {
      return res.status(404).json({ error: "No user found with this id" });
    }

    const summary = await QuarterlyLog.findOne({ userId: user._id }).sort({ createdAt: -1 });

    if (!summary) {
      return res.status(404).json({ error: "No summary found for this user" });
    }

    return res.json({
      quarterName: summary.quarterName,
      quarterIndex: summary.quarterIndex,
      stats: summary.statsSnapshot,
      tasksCompleted: summary.tasksCompleted,
      totalTasks: summary.totalTasks,
      totalScore: summary.totalScore,
      quartersToGraduation: 12 - summary.quarterIndex
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/task/current", async (_req, res) => {
  try {
    return res.json(buildTaskResponse(baseTaskState));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/task/choice", async (req, res) => {
  try {
    const { choiceId } = req.body;

    if (!choiceId) {
      return res.status(400).json({ error: "Missing choiceId" });
    }

    const result = applyTaskChoice(choiceId, baseTaskState);

    if (!result) {
      return res.status(404).json({ error: "Invalid choiceId" });
    }

    return res.json({
      message: `Choice recorded: ${result.selectedOptionText}`,
      ...result,
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
