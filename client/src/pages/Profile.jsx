import { useEffect, useState } from "react";
import API from "../utils/api.js";
import { Mail, Trophy, UserCircle2, BriefcaseBusiness } from "lucide-react";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/interview/dashboard");
        setStats(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStats();
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <section>
      <div className="mb-8">
        <h1
          className="text-4xl font-bold tracking-tight"
          style={{ color: "var(--text)" }}
        >
          Profile
        </h1>
        <p className="mt-3 text-lg" style={{ color: "var(--muted)" }}>
          Your account summary and interview performance snapshot.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div
          className="rounded-[28px] p-6 transition hover:scale-[1.005]"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex flex-col items-center text-center">
            <div
              className="flex h-28 w-28 items-center justify-center rounded-full text-3xl font-bold"
              style={{
                background: "var(--accent-soft)",
                color: "var(--accent)",
              }}
            >
              {initials}
            </div>

            <h2
              className="mt-4 text-3xl font-semibold"
              style={{ color: "var(--text)" }}
            >
              {user?.name || "User"}
            </h2>

            <div
              className="mt-2 flex items-center gap-2"
              style={{ color: "var(--muted)" }}
            >
              <Mail size={16} />
              <span>{user?.email || "No email found"}</span>
            </div>

            <div
              className="mt-6 w-full rounded-[24px] p-5 text-left"
              style={{ background: "var(--bg-soft)" }}
            >
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Profile Summary
              </p>
              <p
                className="mt-2 text-sm leading-7"
                style={{ color: "var(--text)" }}
              >
                Active interview practice user focused on improving confidence,
                technical clarity, and answer structure.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <StatCard
            icon={<UserCircle2 size={18} />}
            label="Total Interviews"
            value={stats?.totalInterviews || 0}
          />
          <StatCard
            icon={<Trophy size={18} />}
            label="Average Score"
            value={stats?.averageScore || 0}
          />
          <StatCard
            icon={<BriefcaseBusiness size={18} />}
            label="Practiced Roles"
            value={stats?.roleStats?.length || 0}
          />
          <div
            className="rounded-[28px] p-6 transition hover:scale-[1.005]"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(10px)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Status
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-emerald-400">
              Active Learner
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div
      className="rounded-[28px] p-6 transition hover:scale-[1.005]"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {label}
        </p>
        <div style={{ color: "var(--accent)" }}>{icon}</div>
      </div>
      <h3 className="mt-3 text-4xl font-bold" style={{ color: "var(--text)" }}>
        {value}
      </h3>
    </div>
  );
}
