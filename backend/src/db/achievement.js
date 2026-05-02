import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema(
    {
        achievementKey: {
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

        badgeImage: {
            type: String,
            default: "",
        },

        conditionText: {
            type: String,
            default: "",
        },

        category: {
            type: String,
            enum: ["study", "health", "wealth", "social", "special"],
            default: "special",
        },
    },
    {
        timestamps: true,
    }
);

export const Achievement = mongoose.model("Achievement", AchievementSchema);