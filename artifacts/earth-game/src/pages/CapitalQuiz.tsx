import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { countries, Country, getCountriesByContinent } from "@/data/countries";
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getOptions(correct: Country, pool: Country[]): Country[] {
  const others = pool.filter(c => c.code !== correct.code);
  const shuffled = shuffle(others).slice(0, 3);
  return shuffle([correct, ...shuffled]);
}

export default function CapitalQuiz() {
  const [, setLocation] = useLocation();
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const continent = params.get("continent") || "All";

  const pool = continent === "All" ? countries : getCountriesByContinent(continent);
  const [queue] = useState<Country[]>(() => shuffle(pool));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<Country[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [mode] = useState<"countryToCapital" | "capitalToCountry">(() =>
    Math.random() > 0.5 ? "countryToCapital" : "capitalToCountry"
  );
  const TOTAL_QUESTIONS = Math.min(20, pool.length);
  const currentCountry = queue[currentIndex];

  const generateOptions = useCallback(() => {
    if (currentCountry) {
      setOptions(getOptions(currentCountry, pool));
    }
  }, [currentCountry, pool]);

  useEffect(() => {
    generateOptions();
    setSelected(null);
  }, [currentIndex, generateOptions]);

  const handleAnswer = (code: string) => {
    if (selected) return;
    setSelected(code);
    setTotal(t => t + 1);
    if (code === currentCountry.code) setScore(s => s + 1);
    setTimeout(() => {
      if (total + 1 >= TOTAL_QUESTIONS) {
        setGameOver(true);
      } else {
        setCurrentIndex(i => i + 1);
        setSelected(null);
      }
    }, 1200);
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
              <div className="text-3xl font-bold text-orange-400">{pct}%</div>
              <div className="text-xs text-slate-400">Score</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-400">{score}</div>
              <div className="text-xs text-slate-400">Correct</div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={restart} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl font-bold text-white hover:opacity-90 transition-opacity">
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
    <div className="min-h-screen bg-slate-950 text-white p-4">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setLocation("/")} className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">
              <span className="text-white font-bold">{total}</span>/{TOTAL_QUESTIONS}
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm font-bold">
              <Trophy className="w-4 h-4" /> {score}
            </div>
          </div>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-2 mb-8">
          <div
            className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(total / TOTAL_QUESTIONS) * 100}%` }}
          />
        </div>

        <div className="text-center mb-8">
          {mode === "countryToCapital" ? (
            <>
              <p className="text-slate-400 text-sm mb-4 uppercase tracking-widest font-medium">What is the capital of...</p>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 inline-block">
                <div className="text-5xl mb-2">{currentCountry.flagEmoji}</div>
                <div className="text-3xl font-black text-white">{currentCountry.name}</div>
                <div className="text-slate-400 text-sm mt-1">{currentCountry.continent}</div>
              </div>
            </>
          ) : (
            <>
              <p className="text-slate-400 text-sm mb-4 uppercase tracking-widest font-medium">Which country has this capital?</p>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 inline-block">
                <div className="text-4xl font-black text-white">{currentCountry.capital}</div>
                <div className="text-slate-400 text-sm mt-2">is the capital of...</div>
              </div>
            </>
          )}
          {selected && (
            <div className="mt-4 text-base font-bold text-slate-300 animate-in fade-in slide-in-from-bottom-2">
              {currentCountry.name} — {currentCountry.capital} {currentCountry.flagEmoji}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {options.map((option) => {
            let style = "bg-slate-800 border-slate-700 text-white hover:bg-slate-700";
            if (selected) {
              if (option.code === currentCountry.code) {
                style = "bg-green-900/50 border-green-500 text-green-300";
              } else if (option.code === selected) {
                style = "bg-red-900/50 border-red-500 text-red-300";
              } else {
                style = "bg-slate-800/50 border-slate-700/50 text-slate-500";
              }
            }
            return (
              <button
                key={option.code}
                onClick={() => handleAnswer(option.code)}
                disabled={!!selected}
                className={`relative border rounded-xl p-4 text-left font-semibold text-sm transition-all duration-200 ${style} ${!selected ? "hover:scale-[1.02] active:scale-[0.98]" : ""}`}
              >
                {mode === "countryToCapital" ? (
                  <div>{option.capital}</div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{option.flagEmoji}</span>
                    <span>{option.name}</span>
                  </div>
                )}
                {selected && option.code === currentCountry.code && (
                  <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-green-400" />
                )}
                {selected && option.code === selected && option.code !== currentCountry.code && (
                  <XCircle className="absolute top-2 right-2 w-5 h-5 text-red-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
