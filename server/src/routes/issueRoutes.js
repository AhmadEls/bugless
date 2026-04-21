const express = require("express");
const { createIssue, getAllIssues, getIssueById, updateIssueStatus, addNote, addResolution, addRootCause } = require("../controllers/issueController");

const router = express.Router();

router.post("/", createIssue);
router.get("/", getAllIssues);
router.get("/:id", getIssueById);
router.patch("/:id/status", updateIssueStatus);
router.post("/:id/note", addNote);
router.patch("/:id/root-cause", addRootCause);
router.patch("/:id/resolution", addResolution);
module.exports = router;