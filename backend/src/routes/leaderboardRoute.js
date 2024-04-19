import express from "express";

import * as leaderboardController from "../controllers/leaderboardController.js";

const router = express.Router();

router.get("/", leaderboardController.getLeaderboard); // get table info

export default router;
