import express from "express";
import { Achievement } from "../db/achievement.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const achievements = await Achievement.find({ isDeleted: { $ne: true } })
      .sort({
        category: 1,
        title: 1,
      })
      .lean();

    return res.json({
      success: true,
      total: achievements.length,
      data: achievements,
    });
  } catch (error) {
    console.error("Failed to fetch achievements:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch achievements",
      error: error.message,
    });
  }
});

export default router;