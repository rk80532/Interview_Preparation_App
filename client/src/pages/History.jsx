import { useEffect, useMemo, useState } from "react";
import API from "../utils/api.js";
import { History as HistoryIcon, Search } from "lucide-react";

export default function History() {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/interview/history");
        setHistory(res.data.interviews || []);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load history");
      }
    };

    fetchHistory();
  }, []);

  const filteredHistory = useMemo(() => {
    let items = history;

    if (filter !== "all") {
      items = items.filter((item) => item.role === filter);
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.question.toLowerCase().includes(term) ||
          item.feedback.toLowerCase().includes(term) ||
          item.answer.toLowerCase().includes(term),
      );
    }

    return items;
  }, [history, filter, search]);

  return (
    <section>
      <div className="mb-8">
        <div
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em]"
          style={{
            borderColor: "var(--border)",
            background: "var(--accent-soft)",
            color: "var(--accent)",
          }}
        >
          <HistoryIcon size={14} />
          Records
        </div>

        <h1
          className="mt-4 text-4xl font-bold tracking-tight"
          style={{ color: "var(--text)" }}
        >
          Interview History
        </h1>
        <p
          className="mt-3 max-w-3xl text-lg leading-8"
          style={{ color: "var(--muted)" }}
        >
          Review your previous attempts, filter by category, and search feedback
          patterns.
        </p>
      </div>

      {message && (
        <div
          className="mb-6 rounded-2xl border px-4 py-3"
          style={{
            background: "rgba(245, 158, 11, 0.08)",
            borderColor: "rgba(245, 158, 11, 0.2)",
            color: "#fcd34d",
          }}
        >
          {message}
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-3">
          {["all", "java", "mern", "dsa", "hr"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className="rounded-full px-4 py-2 text-sm font-medium transition"
              style={{
                background:
                  filter === item ? "var(--accent-soft)" : "transparent",
                color: filter === item ? "var(--accent)" : "var(--text)",
                border:
                  filter === item
                    ? "1px solid rgba(56,189,248,0.3)"
                    : "1px solid var(--border)",
              }}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>

        <div
          className="flex w-full items-center gap-2 rounded-2xl border px-4 py-3 lg:max-w-sm"
          style={{
            background: "var(--bg-soft)",
            borderColor: "var(--border)",
            color: "var(--text)",
          }}
        >
          <Search size={16} style={{ color: "var(--muted)" }} />
          <input
            type="text"
            placeholder="Search question or feedback..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none"
            style={{ color: "var(--text)" }}
          />
        </div>
      </div>

      <div className="space-y-5">
        {filteredHistory.length === 0 ? (
          <div
            className="rounded-[28px] border p-8"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--muted)",
            }}
          >
            No records found.
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item._id}
              className="rounded-[28px] p-6 transition hover:scale-[1.005]"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="rounded-full px-3 py-1 text-sm"
                    style={{
                      background: "var(--accent-soft)",
                      color: "var(--accent)",
                    }}
                  >
                    {item.role.toUpperCase()}
                  </span>

                  {item.difficulty && (
                    <span
                      className="rounded-full px-3 py-1 text-sm"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        color: "var(--muted)",
                      }}
                    >
                      {item.difficulty}
                    </span>
                  )}
                </div>

                <span className="text-sm" style={{ color: "var(--muted)" }}>
                  Score: {item.score}/10
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p
                    className="text-xs uppercase tracking-[0.2em]"
                    style={{ color: "var(--muted)" }}
                  >
                    Question
                  </p>
                  <p className="mt-1" style={{ color: "var(--text)" }}>
                    {item.question}
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs uppercase tracking-[0.2em]"
                    style={{ color: "var(--muted)" }}
                  >
                    Your Answer
                  </p>
                  <p
                    className="mt-1 leading-7"
                    style={{ color: "var(--muted)" }}
                  >
                    {item.answer}
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs uppercase tracking-[0.2em]"
                    style={{ color: "var(--muted)" }}
                  >
                    Feedback
                  </p>
                  <p
                    className="mt-1 leading-7"
                    style={{ color: "var(--muted)" }}
                  >
                    {item.feedback}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
