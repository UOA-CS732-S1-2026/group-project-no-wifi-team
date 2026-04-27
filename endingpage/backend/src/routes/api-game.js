import { Router } from "express";
const router = Router();

/**
 * GET /api/game/:dexNumber
 *
 * Returns detailed information
 */
router.get("/:dexNumber", async (req, res) => {
  try {
    const dexNumber = parseInt(req.params.dexNumber);

    if (isNaN(dexNumber)) {
      return res.status(400).json({ error: "Invalid dex number" });
    }

    // const game = await game.findOne({ dexNumber });
    // if (!game) {
    //   return res.status(404).json({ error: `dex number ${dexNumber} not found` });
    // }
    return res.json(species);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
