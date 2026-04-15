import { useNavigate } from "react-router-dom";
import { Bell, Search } from "lucide-react";

export default function Topbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur-xl"
      style={{
        background: "color-mix(in srgb, var(--bg) 88%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Welcome back
          </p>
          <h2
            className="text-2xl font-semibold"
            style={{ color: "var(--text)" }}
          >
            {user?.name || "User"}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="hidden items-center gap-2 rounded-2xl border px-4 py-2 md:flex"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--muted)",
            }}
          >
            <Search size={16} />
            <span className="text-sm">Search later</span>
          </div>

          <button
            className="rounded-2xl border p-2.5"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            <Bell size={18} />
          </button>

          <button
            onClick={() => navigate("/interview")}
            className="rounded-2xl px-5 py-2.5 text-sm font-semibold transition"
            style={{
              background: "var(--accent)",
              color: "#06202a",
            }}
          >
            Start Interview
          </button>

          <div
            className="flex items-center gap-3 rounded-2xl border px-3 py-2"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
              style={{
                background: "var(--accent-soft)",
                color: "var(--accent)",
              }}
            >
              {initials}
            </div>

            <button
              onClick={handleLogout}
              className="text-sm font-medium"
              style={{ color: "var(--text)" }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
