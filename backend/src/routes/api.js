import { Router } from "express";

const router = Router();

import gameRoutes from "./api-game.js";
router.use("/game", gameRoutes);

export default router;
