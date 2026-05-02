import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { countries, Country, getCountriesByContinent, continents } from "@/data/countries";
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw, Search, Globe2 } from "lucide-react";

export default function FlashCards() {
  const [, setLocation] = useLocation();
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const continent = params.get("continent") || "All";

  const pool = continent === "All" ? countries : getCountriesByContinent(continent);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [search, setSearch] = useState("");
  const [filterContinent, setFilterContinent] = useState(continent);
  const [viewMode, setViewMode] = useState<"cards" | "grid">("cards");

  const filtered = useMemo(() => {
    let result = filterContinent === "All" ? countries : getCountriesByContinent(filterContinent);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.capital.toLowerCase().includes(q));
    }
    return result;
  }, [filterContinent, search]);

  const current = filtered[index];

  const next = () => {
    setFlipped(false);
    setTimeout(() => setIndex(i => (i + 1) % filtered.length), 100);
  };
  const prev = () => {
    setFlipped(false);
    setTimeout(() => setIndex(i => (i - 1 + filtered.length) % filtered.length), 100);
  };

  const continentColors: Record<string, string> = {
    "Africa": "bg-amber-500/20 text-amber-300 border-amber-500/30",
    "Asia": "bg-red-500/20 text-red-300 border-red-500/30",
    "Europe": "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "North America": "bg-green-500/20 text-green-300 border-green-500/30",
    "South America": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    "Oceania": "bg-teal-500/20 text-teal-300 border-teal-500/30",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setLocation("/")} className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-xl font-black text-white">Flash Cards</h1>
          <div className="flex gap-2">
            <button onClick={() => setViewMode("cards")} className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${viewMode === "cards" ? "bg-pink-600 text-white" : "bg-slate-800 text-slate-400"}`}>Cards</button>
            <button onClick={() => setViewMode("grid")} className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${viewMode === "grid" ? "bg-pink-600 text-white" : "bg-slate-800 text-slate-400"}`}>Grid</button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search countries..."
              value={search}
              onChange={e => { setSearch(e.target.value); setIndex(0); }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pink-500"
            />
          </div>
          <select
            value={filterContinent}
            onChange={e => { setFilterContinent(e.target.value); setIndex(0); }}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
          >
            <option value="All">All Regions</option>
            {continents.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <p className="text-slate-400 text-sm mb-6 text-center">{filtered.length} countries</p>

        {viewMode === "cards" && current ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-sm">{index + 1} / {filtered.length}</span>
              <button onClick={() => setFlipped(f => !f)} className="text-sm text-pink-400 hover:text-pink-300 transition-colors">
                Flip card
              </button>
            </div>

            <div
              className="cursor-pointer select-none"
              style={{ perspective: "1000px" }}
              onClick={() => setFlipped(f => !f)}
            >
              <div
                className="relative w-full transition-all duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  minHeight: "340px",
                }}
              >
                <div
                  className="absolute inset-0 bg-slate-900 border border-slate-700 rounded-3xl p-8 flex flex-col items-center justify-center text-center"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="text-[100px] leading-none mb-4">{current.flagEmoji}</div>
                  <h2 className="text-4xl font-black text-white mb-2">{current.name}</h2>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full border ${continentColors[current.continent] || "bg-slate-700 text-slate-300"}`}>
                    {current.continent}
                  </span>
                  <p className="text-slate-500 text-sm mt-4">Tap to reveal details</p>
                </div>

                <div
                  className="absolute inset-0 bg-slate-900 border border-pink-500/30 rounded-3xl p-6 flex flex-col justify-between"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <div className="text-center">
                    <div className="text-5xl mb-2">{current.flagEmoji}</div>
                    <h2 className="text-3xl font-black text-white">{current.name}</h2>
                    <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full border mt-2 ${continentColors[current.continent] || "bg-slate-700 text-slate-300"}`}>
                      {current.continent}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-slate-800 rounded-xl p-3">
                      <div className="text-slate-400 text-xs mb-1">Capital</div>
                      <div className="font-bold text-white">{current.capital}</div>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-3">
                      <div className="text-slate-400 text-xs mb-1">Population</div>
                      <div className="font-bold text-white">{(current.population / 1_000_000).toFixed(1)}M</div>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-3">
                      <div className="text-slate-400 text-xs mb-1">Area</div>
                      <div className="font-bold text-white">{current.area.toLocaleString()} km²</div>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-3">
                      <div className="text-slate-400 text-xs mb-1">Country Code</div>
                      <div className="font-bold text-white">{current.code}</div>
                    </div>
                  </div>
                  <div className="bg-pink-900/20 border border-pink-500/20 rounded-xl p-3">
                    <div className="text-pink-400 text-xs mb-1 font-medium">Fun Fact</div>
                    <p className="text-slate-300 text-xs leading-relaxed">{current.funFact}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button onClick={prev} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => { setIndex(Math.floor(Math.random() * filtered.length)); setFlipped(false); }}
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button onClick={next} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filtered.map((country: Country) => (
              <button
                key={country.code}
                onClick={() => { setViewMode("cards"); setIndex(filtered.indexOf(country)); setFlipped(false); }}
                className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-4 text-left transition-all hover:scale-[1.02]"
              >
                <div className="text-4xl mb-2">{country.flagEmoji}</div>
                <div className="text-sm font-bold text-white truncate">{country.name}</div>
                <div className="text-xs text-slate-400 truncate">{country.capital}</div>
                <div className={`mt-2 text-xs px-2 py-0.5 rounded-full border inline-block ${continentColors[country.continent] || "bg-slate-700 text-slate-300"}`}>
                  {country.continent}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <Globe2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No countries found</p>
          </div>
        )}
      </div>
    </div>
  );
}
