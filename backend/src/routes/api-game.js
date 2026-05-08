import { Router } from "express";
import { QuarterlyLog } from "../db/quarterlyLog.js";
import { User } from "../db/user.js";
import { applyTaskChoice, baseTaskState, buildTaskResponse } from "../data/taskData.js";
import { Event } from "../db/event.js";
import { GameResult } from "../db/gameResult.js";
import Ending from "../db/ending.js";
import { endingData, ENDING_COLLECTION_MAP } from "../data/endingData.js";

const router = Router();

// GET /api/game/events/random?quarter=1
router.get("/events/random", async (req, res) => {
  try {
    const quarter = parseInt(req.query.quarter) || 1;
    const events = await Event.find({ quarter, category: "random" }).lean();
    if (!events.length) return res.status(404).json({ error: "No random events found" });
    const random = events[Math.floor(Math.random() * events.length)];
    return res.json({ event: random });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/game/events?quarter=1
router.get("/events", async (req, res) => {
  try {
    const quarter = parseInt(req.query.quarter) || 1;
    const events = await Event.find(
      { quarter, category: { $ne: "random" } },
      { __v: 0 }
    ).lean();
    return res.json({ quarter, events });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

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
 * POST /api/game/result
 * Save a completed game result and auto-unlock the corresponding collection ending.
 */
const VALID_ENDING_RANKS = ["S", "A", "B", "C"];
const VALID_ENDING_THEMES = ["happy", "bad"];

router.post("/result", async (req, res) => {
  try {
    const { userId, characterId, playerName, score, endingId, endingTitle, endingRank, endingTheme, snapshot, achievements, timestamp } = req.body;

    if (!playerName || !endingId || !endingTitle || !endingRank || !endingTheme || !snapshot) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const scoreNum = Number(score);
    if (!Number.isFinite(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      return res.status(400).json({ success: false, message: "score must be a finite number between 0 and 100" });
    }

    if (!VALID_ENDING_RANKS.includes(endingRank)) {
      return res.status(400).json({ success: false, message: `endingRank must be one of: ${VALID_ENDING_RANKS.join(", ")}` });
    }

    if (!VALID_ENDING_THEMES.includes(endingTheme)) {
      return res.status(400).json({ success: false, message: `endingTheme must be one of: ${VALID_ENDING_THEMES.join(", ")}` });
    }

    const timestampNum = timestamp !== undefined ? Number(timestamp) : Date.now();
    if (!Number.isFinite(timestampNum)) {
      return res.status(400).json({ success: false, message: "timestamp must be a numeric value" });
    }

    const result = await GameResult.create({
      userId: userId ?? null,
      characterId: characterId ?? null,
      playerName,
      score: scoreNum,
      endingId,
      endingTitle,
      endingRank,
      endingTheme,
      snapshot: {
        intelligence: Number(snapshot.intelligence) || 0,
        health: Number(snapshot.health) || 0,
        wealth: Number(snapshot.wealth) || 0,
      },
      achievements: Array.isArray(achievements) ? achievements : [],
      timestamp: timestampNum,
    });

    const collectionKey = ENDING_COLLECTION_MAP[endingId];
    if (collectionKey) {
      const endingDef = endingData.find((e) => e.endingKey === collectionKey);
      await Ending.findOneAndUpdate(
        { endingKey: collectionKey },
        {
          $set: { status: "Unlocked" },
          $setOnInsert: {
            endingId: collectionKey,
            title: endingDef?.title ?? collectionKey,
            category: endingDef?.category ?? "",
            description: endingDef?.description ?? "",
            image: endingDef?.image ?? "",
          },
        },
        { upsert: true },
      );
    }

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("Failed to save game result:", error);
    return res.status(500).json({ success: false, message: "Failed to save game result", error: error.message });
  }
});

/**
 * GET /api/game/results
 * Returns all game results sorted by score (leaderboard).
 * Optional query param: ?limit=20
 */
router.get("/results", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const results = await GameResult.find({}).sort({ score: -1, timestamp: -1 }).limit(limit).lean();
    return res.json({ success: true, total: results.length, data: results });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to get results", error: error.message });
  }
});

/**
 * GET /api/game/result/latest
 * Returns the most recent result. Pass x-user-id header to filter by user.
 */
router.get("/result/latest", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] || null;
    const query = userId ? { userId } : {};
    const result = await GameResult.findOne(query).sort({ timestamp: -1 }).lean();
    if (!result) {
      return res.status(404).json({ success: false, message: "No result found" });
    }
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to get latest result", error: error.message });
  }
});

export default router;
