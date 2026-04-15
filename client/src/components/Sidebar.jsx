import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Mic,
  History as HistoryIcon,
  User,
  Settings,
  Sparkles,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Interview", path: "/interview", icon: Mic },
  { name: "History", path: "/history", icon: HistoryIcon },
  { name: "Profile", path: "/profile", icon: User },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside
      className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r lg:block"
      style={{
        background: "var(--bg-soft)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex h-full flex-col px-5 py-6">
        <div className="mb-8 flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
          >
            <Sparkles size={22} />
          </div>

          <div>
            <h1
              className="text-2xl font-semibold"
              style={{ color: "var(--text)" }}
            >
              InterviewAI
            </h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Practice workspace
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition"
                style={({ isActive }) => ({
                  background: isActive ? "var(--accent-soft)" : "transparent",
                  color: isActive ? "var(--accent)" : "var(--text)",
                  border: isActive
                    ? "1px solid rgba(56,189,248,0.3)"
                    : "1px solid transparent",
                })}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div
          className="mt-auto rounded-3xl border p-5"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
            backdropFilter: "blur(10px)",
          }}
        >
          <p
            className="text-base font-semibold"
            style={{ color: "var(--text)" }}
          >
            Pro tip
          </p>
          <p
            className="mt-2 text-sm leading-6"
            style={{ color: "var(--muted)" }}
          >
            Practice daily, review your history, and focus on low-scoring
            categories first.
          </p>
        </div>
      </div>
    </aside>
  );
}
