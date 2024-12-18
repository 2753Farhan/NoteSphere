import { Router } from "express";
import multer from "multer";
import { uploadNotes } from "../controllers/notesController.js";
import { generateQuiz } from "../controllers/quizController.js";
import { chatWithNotes } from "../controllers/chatController.js";

const router = Router();

// Set up file upload using Multer
const upload = multer({ dest: "uploads/" });

// Notes Routes
// Route for uploading notes and extracting text
router.post("/upload", upload.single("file"), uploadNotes);

// Route for generating quizzes based on notes
router.post("/generate-quiz", generateQuiz);

// Route for querying notes (chat functionality)
router.post("/chat", chatWithNotes);

export default router;
