// routes/predefinedInterviewRouter.js
const express = require("express");
const {
  generateQuestions,
  evaluateAnswers,
} = require("../controllers/predefinedInterviewController");

const router = express.Router();

// POST /api/interview/questions
router.post("/questions", generateQuestions);

// POST /api/interview/evaluate
router.post("/evaluate", evaluateAnswers);

module.exports = router;
