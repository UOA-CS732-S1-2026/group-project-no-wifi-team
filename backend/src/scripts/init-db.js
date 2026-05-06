import "dotenv/config";
import mongoose from "mongoose";
import { Event } from "../db/event.js";
import { eventData } from "../data/eventData.js";

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

await mongoose.disconnect();
console.log("\nDone. Database seeded successfully!");
