import "dotenv/config";
import mongoose from "mongoose";
import monthlyData from "../data/monthlyData.js";

await mongoose.connect(process.env.DB_URL);
console.log("Connected to database!");
console.log();

await clearDatabase();
console.log();

await monthlyData;
console.log();

// Disconnect when complete
await mongoose.disconnect();
console.log("Disconnected from database!");

/**
 * Clears all existing data from the database collections.
 */
// async function clearDatabase() {
//   // await Species.deleteMany();
//   console.log("Database cleared");
// }
