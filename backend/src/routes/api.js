import { Router } from "express";

const router = Router();

import gameRoutes from "./api-game.js";
import endingRoutes from "./api-ending.js";

router.use("/game", gameRoutes);
router.use("/endings", endingRoutes);

export default router;
