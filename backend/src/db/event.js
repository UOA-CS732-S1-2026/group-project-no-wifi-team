import mongoose from "mongoose";

const effectsSchema = {
  intelligence: { type: Number, default: 0 },
  health: { type: Number, default: 0 },
  wealth: { type: Number, default: 0 },
};

const optionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    story: { type: String, default: "" },
    effects: effectsSchema,
    achievementKey: { type: String, default: null },
  },
  { _id: false }
);

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
    options: { type: [optionSchema], default: [] },
    achievementKey: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

EventSchema.index({ quarter: 1, category: 1, isDeleted: 1 });

export const Event = mongoose.model("Event", EventSchema);
