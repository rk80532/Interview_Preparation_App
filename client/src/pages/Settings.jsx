import { useEffect, useState } from "react";
import {
  Moon,
  Sun,
  Save,
  Bell,
  Briefcase,
  TimerReset,
  Palette,
} from "lucide-react";

function SettingsCard({ icon, title, subtitle, children }) {
  return (
    <div
      className="rounded-[28px] p-6 transition hover:scale-[1.01]"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="mb-5 flex items-start gap-3">
        <div
          className="rounded-2xl p-2.5"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>
            {title}
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            {subtitle}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

function SettingsSelect({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full rounded-2xl border px-4 py-3 outline-none"
      style={{
        background: "var(--bg-soft)",
        borderColor: "var(--border)",
        color: "var(--text)",
      }}
    >
      {children}
    </select>
  );
}

function SettingsToggle({ checked, onChange, label, desc }) {
  return (
    <div
      className="flex items-center justify-between rounded-2xl px-4 py-4"
      style={{ background: "var(--bg-soft)", border: "1px solid var(--border)" }}
    >
      <div>
        <p className="font-medium" style={{ color: "var(--text)" }}>
          {label}
        </p>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {desc}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        className="relative h-7 w-14 rounded-full transition"
        style={{
          background: checked ? "var(--accent)" : "rgba(255,255,255,0.12)",
        }}
      >
        <span
          className="absolute top-1 h-5 w-5 rounded-full bg-white transition"
          style={{
            left: checked ? "calc(100% - 1.5rem)" : "0.25rem",
          }}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [defaultRole, setDefaultRole] = useState(
    localStorage.getItem("defaultRole") || "java"
  );
  const [defaultDifficulty, setDefaultDifficulty] = useState(
    localStorage.getItem("defaultDifficulty") || "medium"
  );
  const [defaultTimer, setDefaultTimer] = useState(
    localStorage.getItem("defaultTimer") || "120"
  );
  const [autoSave, setAutoSave] = useState(
    localStorage.getItem("autoSave") === "true"
  );
  const [notifications, setNotifications] = useState(
    localStorage.getItem("notifications") !== "false"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("defaultRole", defaultRole);
    localStorage.setItem("defaultDifficulty", defaultDifficulty);
    localStorage.setItem("defaultTimer", defaultTimer);
    localStorage.setItem("autoSave", autoSave);
    localStorage.setItem("notifications", notifications);
  }, [theme, defaultRole, defaultDifficulty, defaultTimer, autoSave, notifications]);

  const handleSave = () => {
    localStorage.setItem("theme", theme);
    window.dispatchEvent(new Event("storage"));
    setMessage("Settings saved successfully");
    setTimeout(() => setMessage(""), 2000);
  };

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
          <Palette size={14} />
          Preferences
        </div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
          Settings
        </h1>
        <p className="mt-3 max-w-3xl text-lg leading-8" style={{ color: "var(--muted)" }}>
          Personalize your interview workspace, default practice setup, and overall experience.
        </p>
      </div>

      {message && (
        <div
          className="mb-6 rounded-2xl border px-4 py-3"
          style={{
            background: "rgba(16, 185, 129, 0.08)",
            borderColor: "rgba(16, 185, 129, 0.2)",
            color: "#86efac",
          }}
        >
          {message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <SettingsCard
          icon={<Sun size={18} />}
          title="Appearance"
          subtitle="Choose how the platform looks."
        >
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm" style={{ color: "var(--muted)" }}>
                Theme
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTheme("dark")}
                  className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-medium transition"
                  style={{
                    background: theme === "dark" ? "var(--accent-soft)" : "var(--bg-soft)",
                    color: theme === "dark" ? "var(--accent)" : "var(--text)",
                    border:
                      theme === "dark"
                        ? "1px solid rgba(56,189,248,0.3)"
                        : "1px solid var(--border)",
                  }}
                >
                  <Moon size={16} />
                  Dark
                </button>

                <button
                  onClick={() => setTheme("light")}
                  className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-medium transition"
                  style={{
                    background: theme === "light" ? "var(--accent-soft)" : "var(--bg-soft)",
                    color: theme === "light" ? "var(--accent)" : "var(--text)",
                    border:
                      theme === "light"
                        ? "1px solid rgba(56,189,248,0.3)"
                        : "1px solid var(--border)",
                  }}
                >
                  <Sun size={16} />
                  Light
                </button>
              </div>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard
          icon={<Briefcase size={18} />}
          title="Interview Defaults"
          subtitle="Set your preferred starting setup."
        >
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm" style={{ color: "var(--muted)" }}>
                Default Role
              </label>
              <SettingsSelect value={defaultRole} onChange={(e) => setDefaultRole(e.target.value)}>
                <option value="java">Java</option>
                <option value="mern">MERN</option>
                <option value="dsa">DSA</option>
                <option value="hr">HR</option>
              </SettingsSelect>
            </div>

            <div>
              <label className="mb-2 block text-sm" style={{ color: "var(--muted)" }}>
                Default Difficulty
              </label>
              <SettingsSelect
                value={defaultDifficulty}
                onChange={(e) => setDefaultDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </SettingsSelect>
            </div>

            <div>
              <label className="mb-2 block text-sm" style={{ color: "var(--muted)" }}>
                Default Timer
              </label>
              <SettingsSelect value={defaultTimer} onChange={(e) => setDefaultTimer(e.target.value)}>
                <option value="60">1 minute</option>
                <option value="120">2 minutes</option>
                <option value="180">3 minutes</option>
                <option value="300">5 minutes</option>
              </SettingsSelect>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard
          icon={<TimerReset size={18} />}
          title="Workflow"
          subtitle="Control how your session behaves."
        >
          <div className="space-y-4">
            <SettingsToggle
              checked={autoSave}
              onChange={() => setAutoSave(!autoSave)}
              label="Auto-save draft answers"
              desc="Preserve your answer while typing."
            />
          </div>
        </SettingsCard>

        <SettingsCard
          icon={<Bell size={18} />}
          title="Experience"
          subtitle="Quality-of-life preferences."
        >
          <div className="space-y-4">
            <SettingsToggle
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
              label="Interface notifications"
              desc="Show helpful prompts and save confirmations."
            />
          </div>
        </SettingsCard>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold transition"
          style={{ background: "var(--accent)", color: "#06202a" }}
        >
          <Save size={18} />
          Save Settings
        </button>
      </div>
    </section>
  );
}