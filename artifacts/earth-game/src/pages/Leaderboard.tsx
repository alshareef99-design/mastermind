import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Trophy, Flag, Map, Globe2, BookOpen, Trash2 } from "lucide-react";

interface ScoreEntry {
  mode: string;
  score: number;
  total: number;
  continent: string;
  date: string;
}

const MODE_ICONS: Record<string, React.ReactNode> = {
  "Flag Quiz": <Flag className="w-4 h-4" />,
  "Map Quiz": <Map className="w-4 h-4" />,
  "Shape Quiz": <Globe2 className="w-4 h-4" />,
  "Capital Quiz": <BookOpen className="w-4 h-4" />,
};

const MODE_COLORS: Record<string, string> = {
  "Flag Quiz": "text-blue-400 bg-blue-500/10 border-blue-500/30",
  "Map Quiz": "text-green-400 bg-green-500/10 border-green-500/30",
  "Shape Quiz": "text-purple-400 bg-purple-500/10 border-purple-500/30",
  "Capital Quiz": "text-orange-400 bg-orange-500/10 border-orange-500/30",
};

export default function Leaderboard() {
  const [, setLocation] = useLocation();
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("earth-game-scores");
      if (stored) setScores(JSON.parse(stored));
    } catch {
      setScores([]);
    }
  }, []);

  const clearScores = () => {
    localStorage.removeItem("earth-game-scores");
    setScores([]);
  };

  const grouped = scores.reduce<Record<string, ScoreEntry[]>>((acc, s) => {
    if (!acc[s.mode]) acc[s.mode] = [];
    acc[s.mode].push(s);
    return acc;
  }, {});

  const stats = Object.entries(grouped).map(([mode, entries]) => {
    const best = Math.max(...entries.map(e => Math.round((e.score / e.total) * 100)));
    const avg = Math.round(entries.reduce((sum, e) => sum + (e.score / e.total) * 100, 0) / entries.length);
    return { mode, best, avg, played: entries.length };
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setLocation("/")} className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-2xl font-black">My Scores</h1>
          {scores.length > 0 && (
            <button onClick={clearScores} className="flex items-center gap-1 text-slate-500 hover:text-red-400 transition-colors text-xs">
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        {scores.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-slate-700" />
            <h2 className="text-xl font-bold text-slate-500 mb-2">No scores yet</h2>
            <p className="text-slate-600 mb-6">Complete a quiz to see your scores here</p>
            <button onClick={() => setLocation("/")} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold text-white hover:opacity-90 transition-opacity">
              Start Playing
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {stats.map((s) => (
                <div key={s.mode} className={`border rounded-xl p-4 ${MODE_COLORS[s.mode] || "text-slate-400 bg-slate-800/30 border-slate-700"}`}>
                  <div className="flex items-center gap-2 mb-2 opacity-80">
                    {MODE_ICONS[s.mode]}
                    <span className="text-xs font-medium">{s.mode}</span>
                  </div>
                  <div className="text-2xl font-black">{s.best}%</div>
                  <div className="text-xs opacity-60">Best · {s.played} played</div>
                </div>
              ))}
            </div>

            <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">Recent Games</h2>
            <div className="space-y-2">
              {[...scores].reverse().slice(0, 20).map((entry, i) => {
                const pct = Math.round((entry.score / entry.total) * 100);
                return (
                  <div key={i} className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg border ${MODE_COLORS[entry.mode] || "text-slate-400 bg-slate-800 border-slate-700"}`}>
                        {MODE_ICONS[entry.mode] || <Trophy className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{entry.mode}</div>
                        <div className="text-xs text-slate-400">{entry.continent} · {entry.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-black ${pct >= 80 ? "text-green-400" : pct >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                        {pct}%
                      </div>
                      <div className="text-xs text-slate-500">{entry.score}/{entry.total}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
