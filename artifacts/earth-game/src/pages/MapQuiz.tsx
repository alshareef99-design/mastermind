import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { countries, Country, getCountriesByContinent } from "@/data/countries";
import { ArrowLeft, Trophy, RotateCcw, Map } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const SVG_W = 800;
const SVG_H = 450;

function latLngToXY(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * SVG_W;
  const y = ((90 - lat) / 180) * SVG_H;
  return { x, y };
}

const CONTINENT_COLORS: Record<string, string> = {
  "Africa": "#f59e0b",
  "Asia": "#ef4444",
  "Europe": "#3b82f6",
  "North America": "#22c55e",
  "South America": "#eab308",
  "Oceania": "#14b8a6",
};

export default function MapQuiz() {
  const [, setLocation] = useLocation();
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const continent = params.get("continent") || "All";
  const pool = continent === "All" ? countries : getCountriesByContinent(continent);

  const [queue] = useState<Country[]>(() => shuffle(pool));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<Country | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hints, setHints] = useState(false);
  const [clickedPos, setClickedPos] = useState<{ x: number; y: number } | null>(null);

  const TOTAL_QUESTIONS = Math.min(20, pool.length);
  const currentCountry = queue[currentIndex];

  const targetPos = latLngToXY(currentCountry?.lat ?? 0, currentCountry?.lng ?? 0);

  const getDistance = useCallback((a: { x: number; y: number }, b: { x: number; y: number }) => {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }, []);

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (selected) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = SVG_W / rect.width;
    const scaleY = SVG_H / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    setClickedPos({ x, y });

    const dist = getDistance({ x, y }, targetPos);
    const isCorrect = dist < 40;
    if (isCorrect) setScore(s => s + 1);
    setSelected(currentCountry);
    setTotal(t => t + 1);

    setTimeout(() => {
      if (total + 1 >= TOTAL_QUESTIONS) {
        setGameOver(true);
      } else {
        setCurrentIndex(i => i + 1);
        setSelected(null);
        setClickedPos(null);
      }
    }, 2000);
  };

  const restart = () => {
    window.location.reload();
  };

  if (gameOver) {
    const pct = Math.round((score / TOTAL_QUESTIONS) * 100);
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">{pct >= 80 ? "🏆" : pct >= 60 ? "🌟" : "📚"}</div>
          <h2 className="text-3xl font-black text-white mb-2">Quiz Complete!</h2>
          <p className="text-slate-400 mb-6">You got {score} out of {TOTAL_QUESTIONS} correct</p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-800 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-400">{pct}%</div>
              <div className="text-xs text-slate-400">Accuracy</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-400">{score}</div>
              <div className="text-xs text-slate-400">Correct</div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={restart} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl font-bold text-white hover:opacity-90 transition-opacity">
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
            <button onClick={() => setLocation("/")} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 rounded-xl font-bold text-slate-300 hover:bg-slate-700 transition-colors">
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCountry) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <div className="px-4 py-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <button onClick={() => setLocation("/")} className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-4">
          <button onClick={() => setHints(h => !h)} className={`text-xs px-3 py-1 rounded-full border transition-colors ${hints ? "border-green-500 text-green-400" : "border-slate-600 text-slate-400"}`}>
            {hints ? "Hints ON" : "Hints OFF"}
          </button>
          <div className="text-sm text-slate-400">
            <span className="text-white font-bold">{total}</span>/{TOTAL_QUESTIONS}
          </div>
          <div className="flex items-center gap-1 text-green-400 text-sm font-bold">
            <Trophy className="w-4 h-4" /> {score}
          </div>
        </div>
      </div>

      <div className="w-full bg-slate-800 h-1">
        <div
          className="bg-gradient-to-r from-green-500 to-teal-500 h-1 transition-all duration-300"
          style={{ width: `${(total / TOTAL_QUESTIONS) * 100}%` }}
        />
      </div>

      <div className="px-4 py-3 text-center max-w-5xl mx-auto w-full">
        <p className="text-slate-400 text-sm uppercase tracking-widest font-medium mb-1">Click where you find...</p>
        <div className="inline-flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3">
          <span className="text-4xl">{currentCountry.flagEmoji}</span>
          <div className="text-left">
            <div className="text-2xl font-black text-white">{currentCountry.name}</div>
            {hints && <div className="text-sm text-slate-400">{currentCountry.continent}</div>}
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pb-4 max-w-5xl mx-auto w-full">
        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            width="100%"
            style={{ display: "block", cursor: selected ? "default" : "crosshair" }}
            onClick={handleMapClick}
          >
            <defs>
              <radialGradient id="oceanGrad" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor="#0c1a2e" />
                <stop offset="100%" stopColor="#060d18" />
              </radialGradient>
            </defs>
            <rect width={SVG_W} height={SVG_H} fill="url(#oceanGrad)" />

            {pool.map((c) => {
              const { x, y } = latLngToXY(c.lat, c.lng);
              const isTarget = c.code === currentCountry.code;
              const color = CONTINENT_COLORS[c.continent] || "#94a3b8";
              return (
                <g key={c.code}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isTarget && selected ? 12 : 4}
                    fill={isTarget && selected ? "#22c55e" : color}
                    fillOpacity={isTarget && selected ? 0.9 : hints && !selected ? 0.35 : 0.6}
                    stroke={isTarget && selected ? "#16a34a" : "transparent"}
                    strokeWidth={2}
                    className="transition-all duration-500"
                  />
                  {isTarget && selected && (
                    <text x={x} y={y - 16} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                      {c.flagEmoji} {c.name}
                    </text>
                  )}
                  {hints && !selected && (
                    <text x={x + 6} y={y + 3} fill={color} fontSize="7" fillOpacity={0.6}>{c.code}</text>
                  )}
                </g>
              );
            })}

            {clickedPos && (
              <g>
                <line
                  x1={clickedPos.x}
                  y1={clickedPos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke={getDistance(clickedPos, targetPos) < 40 ? "#22c55e" : "#ef4444"}
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  opacity={0.8}
                />
                <circle cx={clickedPos.x} cy={clickedPos.y} r={6} fill={getDistance(clickedPos, targetPos) < 40 ? "#22c55e" : "#ef4444"} fillOpacity={0.8} />
              </g>
            )}
          </svg>

          <div className="absolute bottom-3 right-3 flex gap-2">
            {Object.entries(CONTINENT_COLORS).map(([cont, color]) => (
              <div key={cont} className="flex items-center gap-1 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="hidden sm:inline">{cont.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {selected && (
          <div className={`mt-3 p-3 rounded-xl text-center text-sm font-semibold animate-in fade-in slide-in-from-bottom-2 ${
            clickedPos && getDistance(clickedPos, targetPos) < 40
              ? "bg-green-900/40 border border-green-500/40 text-green-300"
              : "bg-red-900/40 border border-red-500/40 text-red-300"
          }`}>
            {clickedPos && getDistance(clickedPos, targetPos) < 40
              ? `Correct! ${currentCountry.name} is shown in green`
              : `Close! The correct location is shown in green`
            }
          </div>
        )}
      </div>
    </div>
  );
}
