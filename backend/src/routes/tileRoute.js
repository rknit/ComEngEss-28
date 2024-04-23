import express from "express";

import * as tileController from "../controllers/tileController.js";

const router = express.Router();

router.get("/initialize", tileController.initialize);
router.get("/map-info", tileController.getTiles);
router.post("/tile-info", tileController.filterTile);
router.post("/", tileController.createTile);

export default router;
