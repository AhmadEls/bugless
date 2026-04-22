const mongoose = require("mongoose");

const activityItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["CREATED", "STATUS_CHANGED", "NOTE_ADDED", "ROOT_CAUSE_ADDED", "RESOLUTION_ADDED"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW",
    },
    category: {
      type: String,
      enum: ["FRONTEND", "BACKEND", "API", "DATABASE", "AUTH", "OTHER"],
      default: "OTHER",
    },
    status: {
      type: String,
      enum: ["OPEN", "INVESTIGATING", "IN_PROGRESS", "RESOLVED"],
      default: "OPEN",
    },
    simulatedLogs: [
      {
        type: String,
      },
    ],
    rootCause: {
      type: String,
      default: "",
    },
    resolutionNotes: {
      type: String,
      default: "",
    },
    createdBy: {
      type: String,
      default: "anonymous",
    },
    activityLog: [activityItemSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Issue", issueSchema);