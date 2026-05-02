import { useState } from "react";
import { useLocation } from "wouter";
import { countries, continents } from "@/data/countries";
import { Globe2, Flag, Map, Trophy, BookOpen, Zap } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedContinent, setSelectedContinent] = useState<string>("All");

  const continentColors: Record<string, string> = {
    "All": "from-indigo-500 to-purple-600",
    "Africa": "from-amber-500 to-orange-600",
    "Asia": "from-red-500 to-pink-600",
    "Europe": "from-blue-500 to-cyan-600",
    "North America": "from-green-500 to-emerald-600",
    "South America": "from-yellow-500 to-lime-600",
    "Oceania": "from-teal-500 to-sky-600",
  };

  const gameModes = [
    {
      id: "flag-quiz",
      title: "Flag Quiz",
      description: "Identify countries by their flags",
      icon: <Flag className="w-8 h-8" />,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-400",
    },
    {
      id: "map-quiz",
      title: "Map Quiz",
      description: "Find countries on the world map",
      icon: <Map className="w-8 h-8" />,
      color: "from-green-500 to-teal-600",
      textColor: "text-green-400",
    },
    {
      id: "shape-quiz",
      title: "Shape Quiz",
      description: "Recognize countries by their shape",
      icon: <Globe2 className="w-8 h-8" />,
      color: "from-purple-500 to-violet-600",
      textColor: "text-purple-400",
    },
    {
      id: "capital-quiz",
      title: "Capital Quiz",
      description: "Match countries to their capitals",
      icon: <BookOpen className="w-8 h-8" />,
      color: "from-orange-500 to-amber-600",
      textColor: "text-orange-400",
    },
    {
      id: "flash-cards",
      title: "Flash Cards",
      description: "Study all countries with detailed cards",
      icon: <Zap className="w-8 h-8" />,
      color: "from-pink-500 to-rose-600",
      textColor: "text-pink-400",
    },
    {
      id: "leaderboard",
      title: "Scores",
      description: "View your best scores and progress",
      icon: <Trophy className="w-8 h-8" />,
      color: "from-yellow-500 to-amber-600",
      textColor: "text-yellow-400",
    },
  ];

  const allOptions = ["All", ...continents];
  const filteredCount = selectedContinent === "All" 
    ? countries.length 
    : countries.filter(c => c.continent === selectedContinent).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl shadow-purple-500/30">
              <Globe2 className="w-14 h-14 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Earth Explorer
          </h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">
            Master the world's countries, flags, capitals, and maps through interactive games
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full text-sm text-slate-300">
            <Globe2 className="w-4 h-4 text-blue-400" />
            {filteredCount} countries to explore
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-3 text-center">Filter by Region</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {allOptions.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedContinent(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedContinent === c
                    ? `bg-gradient-to-r ${continentColors[c]} text-white shadow-lg scale-105`
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {gameModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                const params = selectedContinent !== "All" ? `?continent=${encodeURIComponent(selectedContinent)}` : "";
                setLocation(`/${mode.id}${params}`);
              }}
              className="group relative overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:border-slate-600 hover:shadow-2xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${mode.color} mb-4 shadow-lg`}>
                {mode.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{mode.title}</h3>
              <p className="text-slate-400 text-sm">{mode.description}</p>
              <div className="mt-4 flex items-center gap-1">
                <span className={`text-xs font-medium ${mode.textColor}`}>
                  {mode.id === "leaderboard" ? "View scores" : `Play now`}
                </span>
                <span className={`text-xs ${mode.textColor}`}>→</span>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center text-slate-600 text-sm">
          <p>195 recognized countries — flags, maps, capitals, and fun facts</p>
        </div>
      </div>
    </div>
  );
}
