import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gameSchema = new Schema(
  {
    dexNumber: { type: Number, required: true },
  },
  {
    strict: true
  }
);

export const Game = mongoose.model("Game", gameSchema);
