import { useEffect, useState } from "react";
import { getIssues } from "./api/issues";
import { Routes, Route, useNavigate } from "react-router-dom";
import IssueDetail from "./pages/IssueDetail";

function App() {
  const [issues, setIssues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await getIssues();
        setIssues(data);
      } catch (error) {
        console.error("Failed to fetch issues:", error);
      }
    };

    fetchIssues();
  }, []);

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

          <main className="px-8 py-8">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/20">
                    <h2 className="mb-5 text-lg font-semibold text-white">
                      Issues
                    </h2>

                    {issues.length === 0 ? (
                      <p className="text-sm text-slate-400">No issues found</p>
                    ) : (
                      <ul className="space-y-4">
                        {issues.map((issue) => (
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

                            <div className="mt-4 flex items-center gap-3 text-xs font-medium">
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
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
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