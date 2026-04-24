import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [rootCause, setRootCause] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");

  const fetchIssue = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/issues/${id}`);
      setIssue(res.data);
    } catch (err) {
      console.error("Failed to fetch issue", err);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const updateStatus = async (status) => {
    try {
      await axios.patch(`http://localhost:5000/api/issues/${id}/status`, {
        status,
      });
      fetchIssue();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      await axios.post(`http://localhost:5000/api/issues/${id}/note`, {
        note: newNote,
      });
      setNewNote("");
      fetchIssue();
    } catch (err) {
      console.error("Failed to add note", err);
    }
  };

  const saveRootCause = async () => {
    if (!rootCause.trim()) return;

    try {
      await axios.patch(`http://localhost:5000/api/issues/${id}/root-cause`, {
        rootCause,
      });
      setRootCause("");
      fetchIssue();
    } catch (err) {
      console.error("Failed to save root cause", err);
    }
  };

  const saveResolution = async () => {
    if (!resolutionNotes.trim()) return;

    try {
      await axios.patch(`http://localhost:5000/api/issues/${id}/resolution`, {
        resolutionNotes,
      });
      setResolutionNotes("");
      fetchIssue();
    } catch (err) {
      console.error("Failed to save resolution", err);
    }
  };

  const getActivityStyle = (type) => {
    switch (type) {
      case "CREATED":
        return "bg-blue-500/10 text-blue-300 border-blue-500/20";
      case "STATUS_CHANGED":
        return "bg-yellow-500/10 text-yellow-300 border-yellow-500/20";
      case "NOTE_ADDED":
        return "bg-purple-500/10 text-purple-300 border-purple-500/20";
      case "ROOT_CAUSE_ADDED":
        return "bg-red-500/10 text-red-300 border-red-500/20";
      case "RESOLUTION_ADDED":
        return "bg-green-500/10 text-green-300 border-green-500/20";
      default:
        return "bg-slate-700 text-slate-300";
    }
  };

  if (!issue) {
    return <div className="p-6 text-slate-300">Loading issue...</div>;
  }

  const statuses = ["OPEN", "INVESTIGATING", "IN_PROGRESS", "RESOLVED"];

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/")}
        className="text-sm text-slate-400 hover:text-white transition"
      >
        ← Back
      </button>

      <div className="bg-slate-900 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold text-white">{issue.title}</h1>
        <p className="text-slate-400 mt-2">{issue.description}</p>

        <div className="mt-4 flex gap-2 flex-wrap">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => updateStatus(status)}
              className={`px-3 py-1 rounded-lg text-sm transition ${
                issue.status === status
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-5 rounded-xl">
          <h3 className="text-white font-semibold">Logs</h3>

          {issue.simulatedLogs.map((log, i) => (
            <div key={i} className="mt-2 text-sm text-slate-300">
              {log}
            </div>
          ))}

          <div className="flex mt-4 gap-2">
            <input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add note..."
              className="flex-1 bg-slate-800 p-2 text-white rounded outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addNote}
              disabled={!newNote.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-40"
            >
              Add
            </button>
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl">
          <h3 className="text-white font-semibold">Root Cause</h3>

          <p className="mt-2 text-slate-300">
            {issue.rootCause || "Not provided"}
          </p>

          <div className="flex mt-4 gap-2">
            <input
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              placeholder="Write root cause..."
              className="flex-1 bg-slate-800 p-2 text-white rounded outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={saveRootCause}
              disabled={!rootCause.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-5 rounded-xl">
        <h3 className="text-white font-semibold">Resolution</h3>

        <p className="mt-2 text-slate-300">
          {issue.resolutionNotes || "Not provided"}
        </p>

        <div className="flex mt-4 gap-2">
          <input
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            placeholder="Write resolution..."
            className="flex-1 bg-slate-800 p-2 text-white rounded outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={saveResolution}
            disabled={!resolutionNotes.trim()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>

      <div className="bg-slate-900 p-5 rounded-xl">
        <h3 className="text-white font-semibold">Activity Timeline</h3>

        <div className="mt-4 space-y-3">
          {[...issue.activityLog].reverse().map((item, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${getActivityStyle(
                item.type
              )}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.message}</span>
                <span className="text-xs opacity-70">
                  {new Date(item.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IssueDetail;