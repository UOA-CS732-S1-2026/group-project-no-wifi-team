import express from "express";
import { Achievement } from "../db/achievement.js";

const router = express.Router();
const categoryOrder = ["Study", "Health", "Wealth", "Crown"];

router.get("/", async (req, res) => {
  try {
    const achievements = await Achievement.find({}).lean();

    achievements.sort((a, b) => {
      const categoryDiff =
        categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);

      if (categoryDiff !== 0) return categoryDiff;

      return a.title.localeCompare(b.title);
    });

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
