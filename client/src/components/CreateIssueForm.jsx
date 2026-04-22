import { useState } from "react";
import axios from "axios";

function CreateIssueForm({ onIssueCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "MEDIUM",
    category: "FRONTEND",
    createdBy: "Ahmad",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/issues", formData);

      setFormData({
        title: "",
        description: "",
        severity: "MEDIUM",
        category: "FRONTEND",
        createdBy: "Ahmad",
      });

      onIssueCreated();
    } catch (error) {
      console.error("Failed to create issue:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/20"
    >
      <h2 className="mb-5 text-lg font-semibold text-white">Create Issue</h2>

      <div className="grid gap-4">
        <input
          type="text"
          name="title"
          placeholder="Issue title"
          value={formData.title}
          onChange={handleChange}
          className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
          required
        />

        <textarea
          name="description"
          placeholder="Describe the problem..."
          value={formData.description}
          onChange={handleChange}
          className="min-h-28 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
          required
        />

        <div className="grid gap-4 md:grid-cols-2">
          <select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="FRONTEND">FRONTEND</option>
            <option value="BACKEND">BACKEND</option>
            <option value="API">API</option>
            <option value="DATABASE">DATABASE</option>
            <option value="AUTH">AUTH</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
        >
          Create Issue
        </button>
      </div>
    </form>
  );
}

export default CreateIssueForm;