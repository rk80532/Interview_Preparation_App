import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import {
  Trophy,
  Activity,
  BookOpenCheck,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          API.get("/interview/dashboard"),
          API.get("/interview/history"),
        ]);

        setStats(statsRes.data);
        setHistory(historyRes.data.interviews || []);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load dashboard");
      }
    };

    fetchData();
  }, []);

  const bestScore = useMemo(() => {
    if (!history.length) return 0;
    return Math.max(...history.map((item) => item.score));
  }, [history]);

  const strongestRole = useMemo(() => {
    if (!stats?.roleStats?.length) return "No data";
    const sorted = [...stats.roleStats].sort(
      (a, b) => Number(b.averageScore) - Number(a.averageScore),
    );
    return sorted[0]?.role?.toUpperCase() || "No data";
  }, [stats]);

  const chartData = useMemo(() => {
    return [...history]
      .reverse()
      .slice(-8)
      .map((item, index) => ({
        name: `#${index + 1}`,
        score: item.score,
      }));
  }, [history]);

  const cards = [
    {
      title: "Total Interviews",
      value: stats?.totalInterviews || 0,
      icon: Activity,
    },
    {
      title: "Average Score",
      value: stats?.averageScore || 0,
      icon: BookOpenCheck,
    },
    { title: "Best Score", value: bestScore, icon: Trophy },
    { title: "Strongest Role", value: strongestRole, icon: ArrowRight },
  ];

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
          <BarChart3 size={14} />
          Overview
        </div>

        <h1
          className="mt-4 text-4xl font-bold tracking-tight"
          style={{ color: "var(--text)" }}
        >
          Dashboard
        </h1>
        <p
          className="mt-3 max-w-3xl text-lg leading-8"
          style={{ color: "var(--muted)" }}
        >
          Track performance, monitor score growth, and review your recent
          AI-evaluated practice.
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

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-[28px] p-6 transition hover:scale-[1.01]"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  {card.title}
                </p>
                <div
                  className="rounded-2xl p-2.5"
                  style={{
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                  }}
                >
                  <Icon size={18} />
                </div>
              </div>

              <h2
                className="mt-5 text-4xl font-bold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                {card.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div
          className="rounded-[28px] p-6 transition hover:scale-[1.005]"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3
                className="text-2xl font-semibold"
                style={{ color: "var(--text)" }}
              >
                Progress Graph
              </h3>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                Last 8 interview scores
              </p>
            </div>
          </div>

          {chartData.length === 0 ? (
            <div
              className="rounded-[24px] border p-8 text-center"
              style={{
                background: "var(--bg-soft)",
                borderColor: "var(--border)",
              }}
            >
              <p
                className="text-lg font-medium"
                style={{ color: "var(--text)" }}
              >
                No score data yet
              </p>
              <p className="mt-2" style={{ color: "var(--muted)" }}>
                Complete your first interview to start seeing progress.
              </p>
            </div>
          ) : (
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148,163,184,0.15)"
                  />
                  <XAxis dataKey="name" stroke="var(--muted)" />
                  <YAxis domain={[0, 10]} stroke="var(--muted)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--bg-soft)",
                      border: "1px solid var(--border)",
                      borderRadius: "16px",
                      color: "var(--text)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--accent)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div
          className="rounded-[28px] p-6 transition hover:scale-[1.005]"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="mb-5 flex items-center justify-between">
            <h3
              className="text-2xl font-semibold"
              style={{ color: "var(--text)" }}
            >
              Recent History
            </h3>
            <span className="text-sm" style={{ color: "var(--muted)" }}>
              {history.length} records
            </span>
          </div>

          {history.length === 0 ? (
            <div
              className="rounded-[24px] border p-8 text-center"
              style={{
                background: "var(--bg-soft)",
                borderColor: "var(--border)",
              }}
            >
              <p
                className="text-lg font-medium"
                style={{ color: "var(--text)" }}
              >
                No interview attempts found yet
              </p>
              <p className="mt-2" style={{ color: "var(--muted)" }}>
                Start your first mock interview to see progress here.
              </p>
              <button
                onClick={() => navigate("/interview")}
                className="mt-5 rounded-2xl px-5 py-3 font-semibold"
                style={{ background: "var(--accent)", color: "#06202a" }}
              >
                Start First Interview
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {history.slice(0, 4).map((item) => (
                <div
                  key={item._id}
                  className="rounded-[24px] border p-5"
                  style={{
                    background: "var(--bg-soft)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span
                      className="rounded-full px-3 py-1 text-sm"
                      style={{
                        background: "var(--accent-soft)",
                        color: "var(--accent)",
                      }}
                    >
                      {item.role.toUpperCase()}
                    </span>
                    <span className="text-sm" style={{ color: "var(--muted)" }}>
                      Score: {item.score}/10
                    </span>
                  </div>

                  <p className="font-medium" style={{ color: "var(--text)" }}>
                    {item.question}
                  </p>
                  <p
                    className="mt-2 text-sm leading-6"
                    style={{ color: "var(--muted)" }}
                  >
                    {item.feedback}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
