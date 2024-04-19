import express from "express";

import * as tileController from "../controllers/tileController.js";

const router = express.Router();

router.get("/map-info", tileController.getTiles); // get the whole table info
router.post("/tile-info", tileController.filterTile); // get data of specific tile
router.post("/", tileController.createTile); // create tile color


export default router;
