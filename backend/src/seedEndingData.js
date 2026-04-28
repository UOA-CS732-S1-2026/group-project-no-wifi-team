import dotenv from "dotenv";
dotenv.config();
if (!process.env.DB_URL && !process.env.MONGO_URI) dotenv.config({ path: "env" });
if (!process.env.DB_URL && !process.env.MONGO_URI) dotenv.config({ path: "env." });
import mongoose from "mongoose";
const DB_URL = process.env.DB_URL || process.env.MONGO_URI;
import { Ending } from "./db/ending.js";
import { Achievement } from "./db/achievement.js";
import { Event } from "./db/event.js";

const endings = [
    {
        endingKey: "academic_success",
        title: "Academic Success",
        description:
            "You focused on your studies, achieved excellent grades, and built a strong academic record.",
        endingImage: "",
        rank: "S",
        conditionText: "Intelligence ≥ 80 and Health ≥ 50",
        requiredAttributes: {
            intelligence: 80,
            health: 50,
            wealth: 0,
            social: 0,
        },
    },
    {
        endingKey: "balanced_life",
        title: "Balanced Life",
        description:
            "You maintained a healthy balance between study, social life, money, and wellbeing.",
        endingImage: "",
        rank: "A",
        conditionText: "All attributes ≥ 60",
        requiredAttributes: {
            intelligence: 60,
            health: 60,
            wealth: 60,
            social: 60,
        },
    },
    {
        endingKey: "burnout_ending",
        title: "Burnout Ending",
        description:
            "You pushed yourself too hard and forgot to take care of your health.",
        endingImage: "",
        rank: "C",
        conditionText: "Health ≤ 30",
        requiredAttributes: {
            intelligence: 0,
            health: 0,
            wealth: 0,
            social: 0,
        },
    },
    {
        endingKey: "financial_freedom",
        title: "Financial Freedom",
        description:
            "You managed your money carefully and became financially independent as a student.",
        endingImage: "",
        rank: "A",
        conditionText: "Wealth ≥ 80",
        requiredAttributes: {
            intelligence: 0,
            health: 0,
            wealth: 80,
            social: 0,
        },
    },
    {
        endingKey: "social_butterfly",
        title: "Social Butterfly",
        description:
            "You built strong friendships and became a well-connected international student.",
        endingImage: "",
        rank: "B",
        conditionText: "Social ≥ 80",
        requiredAttributes: {
            intelligence: 0,
            health: 0,
            wealth: 0,
            social: 80,
        },
    },
];

const achievements = [
    {
        achievementKey: "study_master",
        title: "Study Master",
        description: "Reach a high intelligence value through study-related choices.",
        badgeImage: "",
        conditionText: "Intelligence ≥ 80",
        category: "study",
    },
    {
        achievementKey: "fitness_badge",
        title: "Fitness Badge",
        description: "Keep your health high during student life.",
        badgeImage: "",
        conditionText: "Health ≥ 80",
        category: "health",
    },
    {
        achievementKey: "money_manager",
        title: "Money Manager",
        description: "Manage your money carefully and improve your wealth.",
        badgeImage: "",
        conditionText: "Wealth ≥ 80",
        category: "wealth",
    },
    {
        achievementKey: "networking_star",
        title: "Networking Star",
        description: "Build a strong social network overseas.",
        badgeImage: "",
        conditionText: "Social ≥ 80",
        category: "social",
    },
];

const events = [
    {
        eventKey: "exam_week",
        title: "Exam Week",
        description: "A stressful exam week tests your study habits and health.",
        category: "study",
        attributeEffects: {
            intelligence: 10,
            health: -5,
            wealth: 0,
            social: -3,
        },
        possibleAchievementKey: "study_master",
    },
    {
        eventKey: "part_time_job",
        title: "Part-time Job",
        description: "You work part-time to support your living costs.",
        category: "work",
        attributeEffects: {
            intelligence: -2,
            health: -5,
            wealth: 12,
            social: 2,
        },
        possibleAchievementKey: "money_manager",
    },
    {
        eventKey: "gym_challenge",
        title: "Gym Challenge",
        description: "You start a regular fitness routine.",
        category: "health",
        attributeEffects: {
            intelligence: 0,
            health: 12,
            wealth: -3,
            social: 3,
        },
        possibleAchievementKey: "fitness_badge",
    },
    {
        eventKey: "student_party",
        title: "Student Party",
        description: "You join a student party and meet new friends.",
        category: "social",
        attributeEffects: {
            intelligence: -3,
            health: -4,
            wealth: -5,
            social: 12,
        },
        possibleAchievementKey: "networking_star",
    },
];

async function seedData() {
    try {
        await mongoose.connect(DB_URL);

        await Ending.deleteMany({});
        await Achievement.deleteMany({});
        await Event.deleteMany({});

        await Ending.insertMany(endings);
        await Achievement.insertMany(achievements);
        await Event.insertMany(events);

        console.log("Seed data inserted successfully.");
        console.log(`Inserted endings: ${endings.length}`);
        console.log(`Inserted achievements: ${achievements.length}`);
        console.log(`Inserted events: ${events.length}`);

        await mongoose.disconnect();
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
}

seedData();