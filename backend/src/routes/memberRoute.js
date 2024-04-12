import express from "express";

import * as memberController from "../controllers/memberController.js";

const router = express.Router();

router.get("/", memberController.getMembers);
router.post("/", memberController.createMember);
router.delete("/:id", memberController.deleteMember);

export default router;
