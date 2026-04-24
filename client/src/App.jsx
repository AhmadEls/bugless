import { useEffect, useMemo, useState } from "react";
import { getIssues, updateStatus } from "./api/issues";
import { Routes, Route, useNavigate } from "react-router-dom";
import IssueDetail from "./pages/IssueDetail";
import CreateIssueForm from "./components/CreateIssueForm";

function App() {
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchIssues = async () => {
    try {
      const data = await getIssues();
      setIssues(data);
    } catch (error) {
      console.error("Failed to fetch issues:", error);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleStatusChange = async (issueId, status) => {
    try {
      await updateStatus(issueId, status);
      fetchIssues();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const searchValue = search.toLowerCase();

      const matchesStatus =
        statusFilter === "ALL" || issue.status === statusFilter;

      const matchesSeverity =
        severityFilter === "ALL" || issue.severity === severityFilter;

      const matchesSearch =
        issue.title.toLowerCase().includes(searchValue) ||
        issue.description.toLowerCase().includes(searchValue) ||
        issue.category.toLowerCase().includes(searchValue) ||
        issue.severity.toLowerCase().includes(searchValue) ||
        issue.status.toLowerCase().includes(searchValue);

      return matchesStatus && matchesSeverity && matchesSearch;
    });
  }, [issues, statusFilter, severityFilter, search]);

  const totalIssues = issues.length;
  const openIssues = issues.filter((issue) => issue.status === "OPEN").length;
  const inProgressIssues = issues.filter(
    (issue) => issue.status === "IN_PROGRESS"
  ).length;
  const resolvedIssues = issues.filter(
    (issue) => issue.status === "RESOLVED"
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-6 py-5">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Bugless
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Product issue tracker
            </p>
          </div>

          <div className="px-4 py-4">
            <button
              onClick={() => navigate("/")}
              className="w-full rounded-xl bg-slate-800 px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:bg-slate-700"
            >
              Dashboard
            </button>
          </div>

          <div className="px-4">
            <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Recent Issues
            </p>

            <div className="space-y-2">
              {issues.map((issue) => (
                <button
                  key={issue._id}
                  onClick={() => navigate(`/issues/${issue._id}`)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-left transition hover:border-slate-700 hover:bg-slate-800"
                >
                  <p className="truncate text-sm font-medium text-slate-100">
                    {issue.title}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-400">
                    {issue.status} • {issue.severity}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-slate-800 bg-slate-950/80 px-8 py-5">
            <h2 className="text-xl font-semibold text-white">
              Bugless Dashboard
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Track product issues, investigations, and resolutions
            </p>
          </header>

          <main className="space-y-6 px-8 py-8">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
                        <p className="text-sm text-slate-400">Total Issues</p>
                        <h3 className="mt-2 text-3xl font-bold text-white">
                          {totalIssues}
                        </h3>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
                        <p className="text-sm text-slate-400">Open</p>
                        <h3 className="mt-2 text-3xl font-bold text-blue-400">
                          {openIssues}
                        </h3>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
                        <p className="text-sm text-slate-400">In Progress</p>
                        <h3 className="mt-2 text-3xl font-bold text-yellow-400">
                          {inProgressIssues}
                        </h3>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
                        <p className="text-sm text-slate-400">Resolved</p>
                        <h3 className="mt-2 text-3xl font-bold text-green-400">
                          {resolvedIssues}
                        </h3>
                      </div>
                    </div>

                    <CreateIssueForm onIssueCreated={fetchIssues} />

                    <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/20">
                      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-white">
                            Issues
                          </h2>
                          <p className="mt-1 text-sm text-slate-400">
                            Showing {filteredIssues.length} of {issues.length}{" "}
                            issues
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 lg:flex-row">
                          <input
                            type="text"
                            placeholder="Search issues..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 lg:w-72"
                          />

                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-blue-500"
                          >
                            <option value="ALL">All Statuses</option>
                            <option value="OPEN">OPEN</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="RESOLVED">RESOLVED</option>
                          </select>

                          <select
                            value={severityFilter}
                            onChange={(e) => setSeverityFilter(e.target.value)}
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-blue-500"
                          >
                            <option value="ALL">All Severities</option>
                            <option value="LOW">LOW</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="HIGH">HIGH</option>
                          </select>
                        </div>
                      </div>

                      {filteredIssues.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">
                          <p className="text-sm font-medium text-slate-300">
                           No issues found — try adjusting filters or create a new issue.
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Try changing the search text, status, or severity.
                          </p>
                        </div>
                      ) : (
                        <ul className="space-y-4">
                          {filteredIssues.map((issue) => (
                            <li
                              key={issue._id}
                              onClick={() => navigate(`/issues/${issue._id}`)}
                              className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-950 p-5 transition hover:border-slate-700 hover:bg-slate-900 hover:shadow-lg hover:shadow-black/20"
                            >
                              <h3 className="text-lg font-semibold text-white">
                                {issue.title}
                              </h3>

                              <p className="mt-2 text-sm text-slate-400">
                                {issue.description}
                              </p>

                              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium">
                                {["OPEN", "IN_PROGRESS", "RESOLVED"].map(
                                  (statusOption) => (
                                    <button
                                      key={statusOption}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusChange(
                                          issue._id,
                                          statusOption
                                        );
                                      }}
                                      className={`rounded-full px-3 py-1.5 transition ${
                                        issue.status === statusOption
                                          ? "bg-blue-500 text-white"
                                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                      }`}
                                    >
                                      {statusOption}
                                    </button>
                                  )
                                )}

                                <span className="rounded-full bg-red-500/15 px-3 py-1.5 text-red-300">
                                  {issue.severity}
                                </span>

                                <span className="rounded-full bg-slate-700 px-3 py-1.5 text-slate-300">
                                  {issue.category}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
                }
              />

              <Route path="/issues/:id" element={<IssueDetail />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;