import "dotenv/config";
import mongoose from "mongoose";
import { Event } from "../db/event.js";
import { eventData } from "../data/eventData.js";

import Ending from "../db/ending.js";
import { endingData } from "../data/endingData.js";

import { Achievement } from "../db/achievement.js";
import { achievementData } from "../data/achievementData.js";

await mongoose.connect(process.env.DB_URL);
console.log("Connected to database!");

// Upsert events by eventKey
for (const event of eventData) {
  await Event.updateOne(
    { eventKey: event.eventKey },
    {
      $set: {
        title: event.title,
        description: event.description,
        category: event.category,
        quarter: event.quarter,
        participateEffects: event.participateEffects,
        skipEffects: event.skipEffects,
        participateStory: event.participateStory,
        skipStory: event.skipStory,
        possibleAchievementKey: event.possibleAchievementKey ?? "",
      },
    },
    { upsert: true }
  );
}
console.log(`Seeded ${eventData.length} events.`);

// Upsert endings by endingId; preserve status for existing records
for (const ending of endingData) {
  await Ending.updateOne(
    { $or: [{ endingId: ending.endingId }, { endingKey: ending.endingKey }] },
    {
      $set: {
        endingId: ending.endingId,
        endingKey: ending.endingKey,
        title: ending.title,
        category: ending.category,
        description: ending.description,
        image: ending.image,
      },
      $setOnInsert: { status: "Locked" },
    },
    { upsert: true }
  );
}
console.log(`Seeded ${endingData.length} endings.`);

// Upsert achievements by achievementKey
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
      },
    },
    { upsert: true }
  );
}
console.log(`Seeded ${achievementData.length} achievements.`);

await mongoose.disconnect();
console.log("\nDone. Database seeded successfully!");
