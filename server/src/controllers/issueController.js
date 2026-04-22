const Issue = require("../models/Issue");

const createIssue = async (req, res) => {
  try {
    const { title, description, severity, category, createdBy } = req.body;

    const issue = await Issue.create({
      title,
      description,
      severity,
      category,
      createdBy,
      activityLog: [
        {
          type: "CREATED",
          message: `Issue created by ${createdBy || "anonymous"}`,
        },
      ],
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create issue",
      error: error.message,
    });
  }
};

const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch issues",
      error: error.message,
    });
  }
};

const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch issue",
      error: error.message,
    });
  }
};

const updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const allowedStatuses = ["OPEN", "INVESTIGATING", "IN_PROGRESS", "RESOLVED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const oldStatus = issue.status;
    issue.status = status;

    issue.activityLog.push({
      type: "STATUS_CHANGED",
      message: `Status changed from ${oldStatus} to ${status}`,
    });

    await issue.save();

    res.json(issue);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update status",
      error: error.message,
    });
  }
};

const addNote = async (req, res) => {
  try {
    const { note } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.simulatedLogs.push(note);
    issue.activityLog.push({
      type: "NOTE_ADDED",
      message: `Note added: ${note}`,
    });

    await issue.save();

    res.json(issue);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add note",
      error: error.message,
    });
  }
};

const addRootCause = async (req, res) => {
  try {
    const { rootCause } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.rootCause = rootCause;
    issue.activityLog.push({
      type: "ROOT_CAUSE_ADDED",
      message: `Root cause added`,
    });

    await issue.save();

    res.json(issue);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add root cause",
      error: error.message,
    });
  }
};

const addResolution = async (req, res) => {
  try {
    const { resolutionNotes } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.resolutionNotes = resolutionNotes;
    issue.activityLog.push({
      type: "RESOLUTION_ADDED",
      message: `Resolution added`,
    });

    await issue.save();

    res.json(issue);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add resolution",
      error: error.message,
    });
  }
};

module.exports = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssueStatus,
  addNote,
  addRootCause,
  addResolution,
};