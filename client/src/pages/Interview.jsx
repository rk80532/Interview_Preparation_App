import { useEffect, useMemo, useRef, useState } from "react";
import API from "../utils/api.js";
import {
  Clock3,
  Brain,
  Sparkles,
  RotateCcw,
  Send,
  CircleGauge,
  CheckCircle2,
  MessageSquareText,
  Lightbulb,
  Briefcase,
  ShieldCheck,
  TimerReset,
  WandSparkles,
} from "lucide-react";

const TIMER_OPTIONS = [
  { label: "1 min", value: 60 },
  { label: "2 min", value: 120 },
  { label: "3 min", value: 180 },
  { label: "5 min", value: 300 },
];

const DIFFICULTY_OPTIONS = ["easy", "medium", "hard"];

export default function Interview() {
  const [role, setRole] = useState(localStorage.getItem("defaultRole") || "java");
  const [difficulty, setDifficulty] = useState(
    localStorage.getItem("defaultDifficulty") || "medium"
  );

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [selectedTime, setSelectedTime] = useState(120);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const timerRef = useRef(null);
  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    localStorage.setItem("defaultDifficulty", difficulty);
  }, [difficulty]);

  useEffect(() => {
    const autoSave = localStorage.getItem("autoSave") === "true";
    if (autoSave) {
      localStorage.setItem("draftAnswer", answer);
    }
  }, [answer]);

  useEffect(() => {
    const savedAnswer = localStorage.getItem("draftAnswer");
    if (savedAnswer) {
      setAnswer(savedAnswer);
    }
  }, []);

  useEffect(() => {
    if (!isTimerRunning) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsTimerRunning(false);

          if (!autoSubmittedRef.current && question && answer.trim()) {
            autoSubmittedRef.current = true;
            handleSubmit(true);
          } else if (!answer.trim()) {
            setMessage("Time is up. No answer was submitted.");
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, question, answer]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [timeLeft]);

  const timerProgress = useMemo(() => {
    if (!selectedTime) return 0;
    return Math.max(0, Math.min(100, (timeLeft / selectedTime) * 100));
  }, [timeLeft, selectedTime]);

  const timerColor = useMemo(() => {
    if (timeLeft <= 20) return "#f87171";
    if (timeLeft <= 40) return "#fbbf24";
    return "var(--accent)";
  }, [timeLeft]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsTimerRunning(false);
    setTimeLeft(selectedTime);
  };

  const getQuestion = async () => {
    setLoadingQuestion(true);
    setMessage("");
    setResult(null);
    setAnswer("");
    autoSubmittedRef.current = false;

    try {
      const res = await API.post("/interview/question", {
        role,
        difficulty,
      });

      setQuestion(res.data.question);
      localStorage.removeItem("draftAnswer");
      clearInterval(timerRef.current);
      setTimeLeft(selectedTime);
      setIsTimerRunning(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to generate question");
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    if (!question || !answer.trim()) {
      setMessage("Generate a question and write your answer first.");
      return;
    }

    setLoadingSubmit(true);
    setMessage("");

    try {
      const res = await API.post("/interview/submit", {
        role,
        difficulty,
        question,
        answer,
      });

      setResult(res.data.interview);
      localStorage.removeItem("draftAnswer");
      clearInterval(timerRef.current);
      setIsTimerRunning(false);

      if (isAutoSubmit) {
        setMessage("Time is up. Your answer was submitted automatically.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to submit answer");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const resetAll = () => {
    clearInterval(timerRef.current);
    setQuestion("");
    setAnswer("");
    setResult(null);
    setMessage("");
    setIsTimerRunning(false);
    setTimeLeft(selectedTime);
    autoSubmittedRef.current = false;
    localStorage.removeItem("draftAnswer");
  };

  const scoreColor = useMemo(() => {
    if (!result?.score && result?.score !== 0) return "var(--text)";
    if (result.score >= 8) return "#34d399";
    if (result.score >= 5) return "#fbbf24";
    return "#f87171";
  }, [result]);

  return (
    <section>
      <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em]"
            style={{
              borderColor: "var(--border)",
              background: "var(--accent-soft)",
              color: "var(--accent)",
            }}
          >
            <WandSparkles size={14} />
            AI Interview Studio
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
            Premium Interview Workspace
          </h1>
          <p className="mt-3 max-w-3xl text-lg leading-8" style={{ color: "var(--muted)" }}>
            Practice with timed role-based questions and get AI-generated score,
            feedback, and an improved answer suggestion.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div
            className="rounded-2xl border px-4 py-3"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <p className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>
              Role
            </p>
            <p className="mt-1 text-sm font-semibold" style={{ color: "var(--text)" }}>
              {role.toUpperCase()}
            </p>
          </div>

          <div
            className="rounded-2xl border px-4 py-3"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <p className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>
              Difficulty
            </p>
            <p className="mt-1 text-sm font-semibold capitalize" style={{ color: "var(--text)" }}>
              {difficulty}
            </p>
          </div>

          <div
            className="rounded-2xl border px-4 py-3"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <p className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>
              Timer
            </p>
            <p className="mt-1 text-sm font-semibold" style={{ color: timerColor }}>
              {formattedTime}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div
            className="rounded-[28px] border p-6 shadow-sm"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
                  <Briefcase size={15} />
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-2xl border px-4 py-3 outline-none"
                  style={{
                    background: "var(--bg-soft)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  <option value="java">Java</option>
                  <option value="mern">MERN</option>
                  <option value="dsa">DSA</option>
                  <option value="hr">HR</option>
                </select>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
                  <ShieldCheck size={15} />
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full rounded-2xl border px-4 py-3 outline-none"
                  style={{
                    background: "var(--bg-soft)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  {DIFFICULTY_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item[0].toUpperCase() + item.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
                  <TimerReset size={15} />
                  Timer
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setSelectedTime(value);
                    setTimeLeft(value);
                    clearInterval(timerRef.current);
                    setIsTimerRunning(false);
                  }}
                  className="w-full rounded-2xl border px-4 py-3 outline-none"
                  style={{
                    background: "var(--bg-soft)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  {TIMER_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={getQuestion}
                  disabled={loadingQuestion}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold transition disabled:opacity-60"
                  style={{ background: "var(--accent)", color: "#06202a" }}
                >
                  <Sparkles size={18} />
                  {loadingQuestion ? "Generating..." : "Generate"}
                </button>
              </div>
            </div>
          </div>

          <div
            className="rounded-[28px] border p-6 shadow-sm"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p
                  className="text-xs uppercase tracking-[0.2em]"
                  style={{ color: "var(--accent)" }}
                >
                  Question
                </p>
                <h3 className="mt-2 text-xl font-semibold" style={{ color: "var(--text)" }}>
                  Interview Prompt
                </h3>
              </div>
            </div>

            <div
              className="rounded-[24px] border p-5"
              style={{
                background: "var(--bg-soft)",
                borderColor: "var(--border)",
              }}
            >
              {question ? (
                <p className="min-h-[110px] text-lg leading-8" style={{ color: "var(--text)" }}>
                  {question}
                </p>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-lg font-medium" style={{ color: "var(--text)" }}>
                    No question generated yet
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                    Select role, difficulty, and timer. Then click Generate to begin.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="mb-3 block text-sm font-medium" style={{ color: "var(--muted)" }}>
                Your Answer
              </label>

              <textarea
                rows="9"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your answer here in a real interview style..."
                className="w-full min-h-[220px] resize-none rounded-[24px] p-5 outline-none"
                style={{
                  background: "var(--bg-soft)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => handleSubmit(false)}
                disabled={loadingSubmit || !question || !answer.trim()}
                className="flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: "#34d399", color: "#052e24" }}
              >
                <Send size={18} />
                {!question
                  ? "Generate Question First"
                  : !answer.trim()
                  ? "Write Answer First"
                  : loadingSubmit
                  ? "AI Evaluating..."
                  : "Submit for AI Review"}
              </button>

              <button
                onClick={resetAll}
                className="flex items-center gap-2 rounded-2xl border px-5 py-3 font-medium transition"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text)",
                  background: "transparent",
                }}
              >
                <RotateCcw size={18} />
                Reset Session
              </button>
            </div>

            {message && (
              <div
                className="mt-5 rounded-2xl border px-4 py-3"
                style={{
                  background: "rgba(245, 158, 11, 0.08)",
                  borderColor: "rgba(245, 158, 11, 0.2)",
                  color: "#fcd34d",
                }}
              >
                {message}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div
            className="rounded-[28px] border p-6 shadow-sm"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center gap-2">
              <Clock3 size={20} style={{ color: timerColor }} />
              <h3 className="text-2xl font-semibold" style={{ color: "var(--text)" }}>
                Live Timer
              </h3>
            </div>

            <p className="mt-4 text-5xl font-bold tracking-tight" style={{ color: timerColor }}>
              {formattedTime}
            </p>

            <div
              className="mt-5 h-2.5 overflow-hidden rounded-full"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${timerProgress}%`,
                  background: timerColor,
                }}
              />
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setIsTimerRunning(true)}
                disabled={!question || isTimerRunning || timeLeft === 0}
                className="rounded-2xl px-3 py-2 text-sm font-medium disabled:opacity-50"
                style={{
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                }}
              >
                Start
              </button>

              <button
                onClick={() => setIsTimerRunning(false)}
                disabled={!isTimerRunning}
                className="rounded-2xl px-3 py-2 text-sm font-medium disabled:opacity-50"
                style={{
                  background: "rgba(251,191,36,0.12)",
                  color: "#fbbf24",
                }}
              >
                Pause
              </button>

              <button
                onClick={resetTimer}
                className="rounded-2xl px-3 py-2 text-sm font-medium"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "var(--text)",
                }}
              >
                Reset
              </button>
            </div>
          </div>

          <div
            className="rounded-[28px] border p-6 shadow-sm"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center gap-2">
              <Brain size={20} style={{ color: "var(--accent)" }} />
              <h3 className="text-2xl font-semibold" style={{ color: "var(--text)" }}>
                Session Tips
              </h3>
            </div>

            <ul className="mt-5 space-y-3 text-sm leading-7" style={{ color: "var(--muted)" }}>
              <li>• Start with a direct answer, then explain it.</li>
              <li>• Add one example where possible.</li>
              <li>• Keep your explanation structured and relevant.</li>
              <li>• Avoid very short technical responses.</li>
            </ul>
          </div>

          <div
            className="rounded-[28px] border p-6 shadow-sm"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center gap-2">
              <CircleGauge size={20} style={{ color: "var(--accent)" }} />
              <h3 className="text-2xl font-semibold" style={{ color: "var(--text)" }}>
                AI Evaluation
              </h3>
            </div>

            {!result ? (
              <div
                className="mt-5 rounded-[24px] border p-5"
                style={{
                  background: "var(--bg-soft)",
                  borderColor: "var(--border)",
                }}
              >
                <p className="text-lg" style={{ color: "var(--muted)" }}>
                  Your AI score, feedback, and ideal answer will appear here after submission.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div
                  className="rounded-[24px] border p-5"
                  style={{
                    background: "var(--bg-soft)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} style={{ color: scoreColor }} />
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      AI Score
                    </p>
                  </div>
                  <p className="mt-3 text-5xl font-bold tracking-tight" style={{ color: scoreColor }}>
                    {result.score}/10
                  </p>
                </div>

                <div
                  className="rounded-[24px] border p-5"
                  style={{
                    background: "var(--bg-soft)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquareText size={18} style={{ color: "var(--accent)" }} />
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      AI Feedback
                    </p>
                  </div>
                  <p className="mt-3 leading-7" style={{ color: "var(--text)" }}>
                    {result.feedback}
                  </p>
                </div>

                <div
                  className="rounded-[24px] border p-5"
                  style={{
                    background: "var(--bg-soft)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb size={18} style={{ color: "#fbbf24" }} />
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      Ideal Answer
                    </p>
                  </div>
                  <p className="mt-3 leading-7" style={{ color: "var(--text)" }}>
                    {result.idealAnswer}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}