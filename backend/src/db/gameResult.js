import mongoose from 'mongoose'

const snapshotSchema = new mongoose.Schema(
    {
        intelligence: { type: Number, required: true },
        health: { type: Number, required: true },
        wealth: { type: Number, required: true },
    },
    { _id: false },
)

const gameResultSchema = new mongoose.Schema(
    {
        userId: { type: String, default: null },
        characterId: { type: String, default: null },
        playerName: { type: String, required: true, trim: true },
        score: { type: Number, required: true, min: 0, max: 100 },
        endingId: { type: String, required: true, trim: true },
        endingTitle: { type: String, required: true, trim: true },
        endingRank: { type: String, enum: ['S', 'A', 'B', 'C'], required: true },
        endingTheme: { type: String, enum: ['happy', 'bad'], required: true },
        snapshot: { type: snapshotSchema, required: true },
        achievements: { type: [String], default: [] },
        timestamp: { type: Number, default: () => Date.now() },
    },
    { timestamps: true },
)

export const GameResult = mongoose.model('GameResult', gameResultSchema)
