import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
    {
        eventKey: {
            type: String,
            required: true,
            unique: true,
        },

        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            enum: ["study", "work", "health", "social", "random"],
            default: "random",
        },

        attributeEffects: {
            intelligence: {
                type: Number,
                default: 0,
            },
            health: {
                type: Number,
                default: 0,
            },
            wealth: {
                type: Number,
                default: 0,
            },
            social: {
                type: Number,
                default: 0,
            },
        },

        possibleAchievementKey: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

export const Event = mongoose.model("Event", EventSchema);