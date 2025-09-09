const express = require("express");
const uploadMemory = require("../middlewares/multerUpload");

const { checkUser } = require("../middlewares/checkUser");
const { getTailorInfo } = require("../controllers/resumeController");
const resumeRouter = express.Router();

resumeRouter.post(
  "/tailor-info",
  checkUser,
  uploadMemory.fields([
    { name: "resume", maxCount: 1 },
    { name: "job", maxCount: 1 },
  ]),
  getTailorInfo
);

module.exports = resumeRouter;
