// routes/studyGroupRoutes.js
import { Router } from "express";
import { addStudent, matchStudyGroups } from "../controllers/studyGroupController.js";

const router = Router();

router.post("/add-student", addStudent); // Add a student profile
router.post("/match-groups", matchStudyGroups); // Generate study groups

export default router;
