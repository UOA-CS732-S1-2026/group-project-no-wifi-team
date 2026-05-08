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

// Clear existing events
await Event.deleteMany({});
console.log("Cleared existing events.");

// Insert all events
const result = await Event.insertMany(eventData);
console.log(`Inserted ${result.length} events across 4 quarters.`);

const counts = [1, 2, 3, 4].map((q) => ({
  quarter: q,
  count: result.filter((e) => e.quarter === q).length,
}));
counts.forEach(({ quarter, count }) =>
  console.log(`  Quarter ${quarter}: ${count} events`)
);

// Seed endings
await Ending.deleteMany({});
console.log("Cleared existing endings.");

const endingResult = await Ending.insertMany(
  endingData.map((ending) => ({
    endingId: ending.endingId,
    endingKey: ending.endingKey,
    title: ending.title,
    category: ending.category,
    description: ending.description,
    image: ending.image,
    status: "Locked",
  }))
);

console.log(`Inserted ${endingResult.length} endings.`);

// Seed achievements
for (const achievement of achievementData) {
  await Achievement.updateOne(
    {
      achievementKey: achievement.achievementKey,
    },
    {
      $set: {
        achievementKey: achievement.achievementKey,
        title: achievement.title,
        description: achievement.description,
        badgeImage: achievement.badgeImage,
        conditionText: achievement.conditionText,
        category: achievement.category,
      },
    },
    {
      upsert: true,
    }
  );
}

console.log(`Seeded ${achievementData.length} achievements.`);

await mongoose.disconnect();
console.log("\nDone. Database seeded successfully!");
