import mongoose from "mongoose";

const effectsSchema = {
  intelligence: { type: Number, default: 0 },
  health: { type: Number, default: 0 },
  wealth: { type: Number, default: 0 },
};

const EventSchema = new mongoose.Schema(
  {
    eventKey: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["study", "entertainment", "social", "random"],
      required: true,
    },
    quarter: { type: Number, enum: [1, 2, 3, 4], required: true },
    participateEffects: effectsSchema,
    skipEffects: effectsSchema,
    participateStory: { type: String, default: "" },
    skipStory: { type: String, default: "" },
    possibleAchievementKey: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", EventSchema);
