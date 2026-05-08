import { Router } from "express";

const router = Router();

import gameRoutes from "./api-game.js";
import endingRoutes from "./api-ending.js";
import achievementRoutes from "./api-achievement.js";


router.use("/game", gameRoutes);
router.use("/endings", endingRoutes);
router.use("/achievements", achievementRoutes);


export default router;
