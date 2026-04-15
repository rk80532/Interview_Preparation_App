import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section
      className="flex min-h-screen items-center justify-center px-6"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(56,189,248,0.08), transparent 24%), var(--bg)",
        color: "var(--text)",
      }}
    >
      <div className="max-w-3xl text-center">
        <p
          className="text-sm uppercase tracking-[0.2em]"
          style={{ color: "var(--accent)" }}
        >
          Interview practice platform
        </p>

        <h1 className="mt-4 text-5xl font-bold leading-tight">
          Practice smarter and track your interview performance
        </h1>

        <p className="mt-6 text-lg leading-8" style={{ color: "var(--muted)" }}>
          Prepare for Java, MERN, DSA, and HR interviews with dashboard, history
          tracking, profile insights, and customizable settings.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/register"
            className="rounded-2xl px-6 py-3 font-semibold"
            style={{ background: "var(--accent)", color: "#06202a" }}
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="rounded-2xl border px-6 py-3 font-medium"
            style={{
              borderColor: "var(--border)",
              color: "var(--text)",
              background: "var(--card)",
            }}
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
