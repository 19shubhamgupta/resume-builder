const express = require("express");
const uploadMemory = require("../middlewares/multerUpload");
const { checkUser } = require("../middlewares/checkUser");
const { analyzeResume, getUserResumeAnalyses } = require("../controllers/resumeController");

const resumeRouter = express.Router();

// Route for analyzing resume
resumeRouter.post(
  "/tailor-info",
  checkUser,
  uploadMemory.fields([
    { name: "resume", maxCount: 1 },
    { name: "job", maxCount: 1 },
  ]),
  analyzeResume  // Changed from getTailorInfo to analyzeResume
);

// Add route for getting user's resume analyses
resumeRouter.get(
  "/analyses",
  checkUser,
  getUserResumeAnalyses
);

module.exports = resumeRouter;
