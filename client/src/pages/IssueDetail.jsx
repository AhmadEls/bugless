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

  if (!issue) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300 shadow-2xl shadow-black/20">
        Loading issue...
      </div>
    );
  }

  const statuses = ["OPEN", "INVESTIGATING", "IN_PROGRESS", "RESOLVED"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <div className="border-b border-slate-800 pb-5">
          <h1 className="text-2xl font-bold text-white">{issue.title}</h1>
          <p className="mt-2 text-sm text-slate-400">{issue.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium">
            <span className="rounded-full bg-blue-500/15 px-3 py-1.5 text-blue-300">
              {issue.status}
            </span>
            <span className="rounded-full bg-red-500/15 px-3 py-1.5 text-red-300">
              {issue.severity}
            </span>
            <span className="rounded-full bg-slate-700 px-3 py-1.5 text-slate-300">
              {issue.category}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Update Status
          </h2>

          <div className="mt-3 flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => updateStatus(status)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  issue.status === status
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <h3 className="text-lg font-semibold text-white">Logs / Notes</h3>

            <div className="mt-4 space-y-3">
              {issue.simulatedLogs.length > 0 ? (
                issue.simulatedLogs.map((log, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300"
                  >
                    {log}
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No notes yet.</p>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add investigation note..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500"
              />
              <button
                onClick={addNote}
                className="rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
              >
                Add
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <h3 className="text-lg font-semibold text-white">Root Cause</h3>

            <p className="mt-4 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
              {issue.rootCause || "Not provided yet."}
            </p>

            <div className="mt-4 flex gap-3">
              <input
                type="text"
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                placeholder="Write root cause..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500"
              />
              <button
                onClick={saveRootCause}
                className="rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
              >
                Save
              </button>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <h3 className="text-lg font-semibold text-white">Resolution</h3>

          <p className="mt-4 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
            {issue.resolutionNotes || "Not provided yet."}
          </p>

          <div className="mt-4 flex gap-3">
            <input
              type="text"
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Write resolution..."
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500"
            />
            <button
              onClick={saveResolution}
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
            >
              Save
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <h3 className="text-lg font-semibold text-white">Activity Timeline</h3>

          <div className="mt-4 space-y-3">
            {issue.activityLog && issue.activityLog.length > 0 ? (
              [...issue.activityLog]
                .slice()
                .reverse()
                .map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"
                  >
                    <p className="text-sm font-medium text-slate-200">
                      {item.message}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
            ) : (
              <p className="text-sm text-slate-500">No activity yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default IssueDetail;