"use client"

import { useState } from "react"

export default function Home() {
  const [vibe, setVibe] = useState("")
  const [seeds, setSeeds] = useState("")
  const [refs, setRefs] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function dig() {
    if (!vibe && !seeds && !refs) return
    setLoading(true)
    setResults([])
    setError("")
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibe, seeds, refs })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResults(data.artists)
    } catch (err) {
      setError("something went wrong, try again")
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white">

      {/* NAV */}
      <nav className="border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-lg tracking-tight">DIGR</span>
        <a
          href="https://github.com/joeltikoo/digr"
          target="_blank"
          className="text-sm text-zinc-400 hover:text-white transition"
        >
          GitHub
        </a>
      </nav>

      {/* HERO */}
      <section className="max-w-2xl mx-auto px-6 pt-20 pb-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          find music you&apos;ve never heard of
        </h1>
        <p className="text-zinc-400 text-lg">
          describe a vibe, drop some artists you like — DIGR finds underground artists the algorithm never shows you
        </p>
      </section>

      {/* FORM */}
      <section className="max-w-2xl mx-auto px-6 pb-16">
        <div className="flex flex-col gap-3">
          <input
            className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
            placeholder="describe the vibe... (e.g. dark, lo-fi, paranoid late night energy)"
            value={vibe}
            onChange={e => setVibe(e.target.value)}
          />
          <input
            className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
            placeholder="artists you already like (comma separated)"
            value={seeds}
            onChange={e => setSeeds(e.target.value)}
          />
          <input
            className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
            placeholder="reference songs or albums (optional)"
            value={refs}
            onChange={e => setRefs(e.target.value)}
          />
          <button
            onClick={dig}
            disabled={loading || (!vibe && !seeds && !refs)}
            className="bg-white text-black font-bold py-4 rounded-lg hover:bg-zinc-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "digging..." : "dig"}
          </button>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>

        {/* RESULTS */}
        {results.length > 0 && (
          <div className="mt-10 flex flex-col gap-5">
            <p className="text-zinc-500 text-sm">{results.length} artists found</p>
            {results.map((a, i) => (
              <div key={i} className="border border-zinc-800 rounded-lg p-5 hover:border-zinc-600 transition">

                {/* name + vibe */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="font-bold text-lg">{a.name}</h2>
                    <p className="text-zinc-400 text-sm">{a.genre}</p>
                  </div>
                  <span className="text-xs border border-zinc-700 text-zinc-400 px-2 py-1 rounded">
                    {a.vibe}
                  </span>
                </div>

                {/* why */}
                <p className="text-zinc-300 text-sm mb-3">{a.why}</p>

                {/* lastfm tags */}
                {a.tags?.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-3">
                    {a.tags.map((tag, j) => (
                      <span key={j} className="text-xs border border-zinc-700 text-zinc-400 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* obscurity + listeners */}
                {a.obscurity && (
                  <p className="text-xs text-zinc-500 mb-1">
                    obscurity: <span className="text-zinc-300">{a.obscurity}</span>
                    {a.listeners > 0 && (
                      <span className="ml-2">({a.listeners.toLocaleString()} listeners)</span>
                    )}
                  </p>
                )}

                {/* similar artists */}
                {a.similar?.length > 0 && (
                  <p className="text-xs text-zinc-500 mb-4">
                    similar: <span className="text-zinc-300">{a.similar.join(", ")}</span>
                  </p>
                )}

                {/* tracks + albums */}
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">tracks</p>
                    {a.tracks.map((t, j) => (
                      <p key={j} className="text-sm text-zinc-300">
                        {t.title}
                        <span className="text-zinc-600 ml-2">{t.year}</span>
                      </p>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">albums</p>
                    {a.albums.map((al, j) => (
                      <p key={j} className="text-sm text-zinc-300">
                        {al.title}
                        <span className="text-zinc-600 ml-2">{al.year}</span>
                      </p>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-zinc-800 bg-zinc-950">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-10 text-center">how it works</h2>
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl mb-3">01</div>
              <p className="text-sm text-zinc-400">describe the vibe or drop artists you already like</p>
            </div>
            <div>
              <div className="text-3xl mb-3">02</div>
              <p className="text-sm text-zinc-400">AI digs through underground artists to find your match</p>
            </div>
            <div>
              <div className="text-3xl mb-3">03</div>
              <p className="text-sm text-zinc-400">get niche recs with tracks and albums to start with</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 px-6 py-6 flex justify-between items-center text-sm text-zinc-500">
        <span>DIGR — free to use</span>
        <a
          href="https://github.com/joeltikoo/digr"
          target="_blank"
          className="hover:text-white transition"
        >
          open source
        </a>
      </footer>

    </main>
  )
}