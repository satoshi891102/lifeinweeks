"use client";

import { useState, useMemo, useRef, useEffect } from "react";

/* ─── Life phases ─── */
const phases = [
  { name: "Childhood", maxAge: 5, color: "#FDE68A", label: "👶" },
  { name: "School", maxAge: 12, color: "#A7F3D0", label: "📚" },
  { name: "Teenager", maxAge: 18, color: "#93C5FD", label: "🎒" },
  { name: "Young Adult", maxAge: 25, color: "#C4B5FD", label: "🎓" },
  { name: "Building", maxAge: 35, color: "#F9A8D4", label: "🏗️" },
  { name: "Prime", maxAge: 50, color: "#FCA5A5", label: "⚡" },
  { name: "Wisdom", maxAge: 65, color: "#FDBA74", label: "🧠" },
  { name: "Legacy", maxAge: 80, color: "#D1D5DB", label: "🌅" },
  { name: "Bonus", maxAge: 100, color: "#E5E7EB", label: "✨" },
];

const LIFE_EXPECTANCY = 80; // years
const WEEKS_PER_YEAR = 52;
const TOTAL_WEEKS = LIFE_EXPECTANCY * WEEKS_PER_YEAR;

function getPhase(weekIndex: number) {
  const ageInYears = weekIndex / WEEKS_PER_YEAR;
  return phases.find(p => ageInYears < p.maxAge) || phases[phases.length - 1];
}

function getWeeksSinceBirth(birthday: Date): number {
  const now = new Date();
  const diff = now.getTime() - birthday.getTime();
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
}

interface Stats {
  weeksLived: number;
  weeksRemaining: number;
  percentLived: number;
  currentAge: number;
  currentPhase: string;
  summersLeft: number;
  christmasesLeft: number;
}

function calculateStats(birthday: Date): Stats {
  const weeksLived = getWeeksSinceBirth(birthday);
  const weeksRemaining = Math.max(0, TOTAL_WEEKS - weeksLived);
  const percentLived = Math.min(100, (weeksLived / TOTAL_WEEKS) * 100);
  const currentAge = weeksLived / WEEKS_PER_YEAR;
  const currentPhase = (phases.find(p => currentAge < p.maxAge) || phases[phases.length - 1]).name;
  const yearsRemaining = Math.max(0, LIFE_EXPECTANCY - currentAge);

  return {
    weeksLived,
    weeksRemaining,
    percentLived,
    currentAge,
    currentPhase,
    summersLeft: Math.floor(yearsRemaining),
    christmasesLeft: Math.floor(yearsRemaining),
  };
}

/* ─── Week dot component ─── */
function WeekDot({ index, weeksLived, hoveredWeek, setHoveredWeek }: {
  index: number;
  weeksLived: number;
  hoveredWeek: number | null;
  setHoveredWeek: (w: number | null) => void;
}) {
  const phase = getPhase(index);
  const isLived = index < weeksLived;
  const isCurrent = index === weeksLived;
  const isHovered = hoveredWeek === index;
  const year = Math.floor(index / WEEKS_PER_YEAR);
  const weekInYear = index % WEEKS_PER_YEAR;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHoveredWeek(index)}
      onMouseLeave={() => setHoveredWeek(null)}
      title={`Year ${year}, Week ${weekInYear + 1} — ${phase.name}`}
    >
      <div
        className={`w-[5px] h-[5px] sm:w-[6px] sm:h-[6px] rounded-[1px] transition-all duration-150 ${
          isCurrent ? "ring-2 ring-red-500 ring-offset-1 scale-150 z-10" : ""
        } ${isHovered ? "scale-[2] z-10" : ""}`}
        style={{
          background: isLived ? phase.color : isCurrent ? "#EF4444" : "#E5E7EB",
          opacity: isLived ? 1 : 0.3,
        }}
      />
    </div>
  );
}

/* ─── Main ─── */
export default function LifeInWeeks() {
  const [birthday, setBirthday] = useState<string>("");
  const [showGrid, setShowGrid] = useState(false);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const [animationDone, setAnimationDone] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const stats = useMemo(() => {
    if (!birthday) return null;
    return calculateStats(new Date(birthday));
  }, [birthday]);

  const handleStart = () => {
    if (!birthday) return;
    setShowGrid(true);
    // Animate the grid filling in
    setTimeout(() => setAnimationDone(true), 100);
  };

  const handleShare = async () => {
    if (!stats) return;
    const text = `I've lived ${stats.weeksLived.toLocaleString()} of my ~${TOTAL_WEEKS.toLocaleString()} weeks (${stats.percentLived.toFixed(1)}%).\n\n${stats.weeksRemaining.toLocaleString()} weeks remaining.\n${stats.summersLeft} more summers.\n\nVisualize yours → lifeinweeks.vercel.app`;

    if (navigator.share) {
      try { await navigator.share({ title: "Life in Weeks", text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  const handleReset = () => {
    setShowGrid(false);
    setAnimationDone(false);
    setBirthday("");
  };

  return (
    <div className="min-h-screen">
      {/* ─── Landing ─── */}
      {!showGrid && (
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <div className="max-w-lg text-center">
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-gray-900 mb-4">
              Life in Weeks
            </h1>
            <p className="text-lg text-gray-500 mb-10 leading-relaxed">
              Your entire life, visualized as a grid of tiny boxes.
              Each box is one week. {TOTAL_WEEKS.toLocaleString()} total.
              How many have you used?
            </p>

            <div className="max-w-xs mx-auto">
              <label className="block text-sm text-gray-400 mb-2 text-left">When were you born?</label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                min="1924-01-01"
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:outline-none focus:border-gray-900 transition-colors bg-white"
              />

              <button
                onClick={handleStart}
                disabled={!birthday}
                className="w-full mt-4 py-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-2xl font-bold text-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed"
              >
                Show My Life
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-8">
              Your birthday never leaves your browser. No tracking. No storage.
            </p>
          </div>
        </div>
      )}

      {/* ─── Grid View ─── */}
      {showGrid && stats && (
        <div className="animate-fadeIn">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm">Life in Weeks</h2>
                <p className="text-xs text-gray-400">
                  {stats.percentLived.toFixed(1)}% lived · {stats.weeksRemaining.toLocaleString()} weeks remaining
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  Share
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm hover:bg-gray-200 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </header>

          {/* Stats row */}
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-white rounded-2xl border border-gray-200 text-center">
                <div className="text-3xl font-black text-gray-900">{stats.weeksLived.toLocaleString()}</div>
                <div className="text-xs text-gray-400 mt-1">weeks lived</div>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-gray-200 text-center">
                <div className="text-3xl font-black text-gray-500">{stats.weeksRemaining.toLocaleString()}</div>
                <div className="text-xs text-gray-400 mt-1">weeks remaining</div>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-gray-200 text-center">
                <div className="text-3xl font-black text-red-500">{stats.summersLeft}</div>
                <div className="text-xs text-gray-400 mt-1">summers left</div>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-gray-200 text-center">
                <div className="text-3xl font-black" style={{ color: getPhase(stats.weeksLived).color === "#E5E7EB" ? "#6B7280" : getPhase(stats.weeksLived).color }}>
                  {stats.currentPhase}
                </div>
                <div className="text-xs text-gray-400 mt-1">current phase</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: animationDone ? `${stats.percentLived}%` : "0%",
                    background: "linear-gradient(90deg, #FDE68A, #A7F3D0, #93C5FD, #C4B5FD, #F9A8D4, #FCA5A5)",
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>Born</span>
                <span>{stats.percentLived.toFixed(1)}%</span>
                <span>{LIFE_EXPECTANCY} years</span>
              </div>
            </div>

            {/* Phase legend */}
            <div className="flex flex-wrap gap-3 mb-6 justify-center">
              {phases.filter(p => p.maxAge <= LIFE_EXPECTANCY).map((p) => (
                <div key={p.name} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ background: p.color }} />
                  <span className="text-xs text-gray-500">{p.name}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-red-500" />
                <span className="text-xs text-gray-500">You are here</span>
              </div>
            </div>

            {/* The Grid */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-200 overflow-x-auto">
              {/* Column header (week numbers) */}
              <div className="flex gap-[1px] mb-1 ml-8">
                {[1, 10, 20, 30, 40, 52].map((w) => (
                  <div
                    key={w}
                    className="text-[8px] text-gray-300"
                    style={{ position: "absolute", left: `${(w / 52) * 100}%` }}
                  >
                  </div>
                ))}
              </div>

              {/* Grid: 80 rows (years) × 52 columns (weeks) */}
              <div ref={gridRef} className="relative">
                {Array.from({ length: LIFE_EXPECTANCY }).map((_, year) => (
                  <div key={year} className="flex items-center gap-[1px] mb-[1px]">
                    {/* Year label */}
                    <div className="w-7 text-right pr-1.5 text-[9px] text-gray-300 font-mono shrink-0">
                      {year % 5 === 0 ? year : ""}
                    </div>
                    {/* Weeks */}
                    {Array.from({ length: WEEKS_PER_YEAR }).map((_, week) => {
                      const weekIndex = year * WEEKS_PER_YEAR + week;
                      return (
                        <WeekDot
                          key={weekIndex}
                          index={weekIndex}
                          weeksLived={stats.weeksLived}
                          hoveredWeek={hoveredWeek}
                          setHoveredWeek={setHoveredWeek}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Hover tooltip */}
            {hoveredWeek !== null && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium shadow-lg z-50">
                Year {Math.floor(hoveredWeek / WEEKS_PER_YEAR)}, Week {(hoveredWeek % WEEKS_PER_YEAR) + 1} — {getPhase(hoveredWeek).name}
                {hoveredWeek < stats.weeksLived && " (lived)"}
                {hoveredWeek === stats.weeksLived && " ← YOU ARE HERE"}
              </div>
            )}

            {/* Reflection */}
            <div className="mt-8 max-w-lg mx-auto text-center">
              <blockquote className="text-lg text-gray-500 italic leading-relaxed">
                &ldquo;The trouble is, you think you have time.&rdquo;
              </blockquote>
              <p className="text-xs text-gray-400 mt-2">— attributed to Buddha</p>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <button
                onClick={handleShare}
                className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                📤 Share Your Life Grid
              </button>
            </div>
          </div>

          {/* More tools */}
          <div className="max-w-lg mx-auto px-4 mt-8">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 text-center">More free tools</p>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://burnrate-seven.vercel.app"
                className="p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-400 transition-all group"
                target="_blank"
              >
                <div className="text-lg mb-1">🔥</div>
                <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">BurnRate</div>
                <div className="text-xs text-gray-400">How much is this meeting costing?</div>
              </a>
              <a
                href="https://haggle-kappa.vercel.app/check"
                className="p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-400 transition-all group"
                target="_blank"
              >
                <div className="text-lg mb-1">💸</div>
                <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Am I Overpaying?</div>
                <div className="text-xs text-gray-400">Check your bills in 10 seconds</div>
              </a>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center py-8 text-xs text-gray-400 border-t border-gray-200 mt-8">
            <p>Based on an average life expectancy of {LIFE_EXPECTANCY} years.</p>
            <p className="mt-1">Your birthday never leaves your browser.</p>
            <p className="mt-2">
              Built by{" "}
              <a href="https://x.com/memecat671" className="text-gray-500 hover:text-gray-900 transition-colors">
                Basirah
              </a>
              {" "}🔮
            </p>
          </footer>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
