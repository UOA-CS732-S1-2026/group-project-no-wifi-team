import "dotenv/config";
import mongoose from "mongoose";
import { Event } from "../db/event.js";
import { eventData } from "../data/updatedEventData.js";

import Ending from "../db/ending.js";
import { endingData } from "../data/endingData.js";

import { Achievement } from "../db/achievement.js";
import { achievementData } from "../data/achievementData.js";

await mongoose.connect(process.env.DB_URL);
console.log("Connected to database!");

// ── Events ──────────────────────────────────────────────────────────────────

const eventKeys = eventData.map((e) => e.eventKey);

const staleEvents = await Event.updateMany(
  { eventKey: { $nin: eventKeys } },
  { $set: { isDeleted: true } }
);
console.log(`Soft-deleted ${staleEvents.modifiedCount} stale events.`);

for (const event of eventData) {
  await Event.updateOne(
    { eventKey: event.eventKey },
    {
      $set: {
        title: event.title,
        description: event.description,
        category: event.category,
        quarter: event.quarter,
        options: event.options ?? [],
        achievementKey: event.achievementKey ?? null,
        isDeleted: false,
      },
    },
    { upsert: true }
  );
}
console.log(`Seeded ${eventData.length} events.`);

// ── Endings ──────────────────────────────────────────────────────────────────

const endingIds = endingData.map((e) => e.endingId);

const staleEndings = await Ending.updateMany(
  { endingId: { $nin: endingIds } },
  { $set: { isDeleted: true } }
);
console.log(`Soft-deleted ${staleEndings.modifiedCount} stale endings.`);

for (const ending of endingData) {
  await Ending.updateOne(
    { endingId: ending.endingId },
    {
      $set: {
        endingId: ending.endingId,
        endingKey: ending.endingKey,
        title: ending.title,
        category: ending.category,
        description: ending.description,
        image: ending.image,
        isDeleted: false,
      },
      $setOnInsert: { status: "Locked" },
    },
    { upsert: true }
  );
}
console.log(`Seeded ${endingData.length} endings.`);

// ── Achievements ─────────────────────────────────────────────────────────────

const achievementKeys = achievementData.map((a) => a.achievementKey);

const staleAchievements = await Achievement.updateMany(
  { achievementKey: { $nin: achievementKeys } },
  { $set: { isDeleted: true } }
);
console.log(`Soft-deleted ${staleAchievements.modifiedCount} stale achievements.`);

for (const achievement of achievementData) {
  await Achievement.updateOne(
    { achievementKey: achievement.achievementKey },
    {
      $set: {
        title: achievement.title,
        description: achievement.description,
        badgeImage: achievement.badgeImage,
        conditionText: achievement.conditionText,
        category: achievement.category,
        isDeleted: false,
      },
    },
    { upsert: true }
  );
}
console.log(`Seeded ${achievementData.length} achievements.`);

await mongoose.disconnect();
console.log("\nDone. Database seeded successfully!");
