"use client"

import { useState } from "react"

export default function Home() {
  const [vibe, setVibe] = useState("")
  const [seeds, setSeeds] = useState("")
  const [refs, setRefs] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  async function dig() {
  setLoading(true)
  setResults([])
  const res = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vibe, seeds, refs })
  })
  const data = await res.json()
  if (data.error) {
    console.error(data.error)
    setLoading(false)
    return
  }
  setResults(data.artists)
  setLoading(false)
}

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">DIGR</h1>

      <div className="flex flex-col gap-4 mb-6">
        <input
          className="border p-3 rounded bg-transparent"
          placeholder="describe the vibe..."
          value={vibe}
          onChange={e => setVibe(e.target.value)}
        />
        <input
          className="border p-3 rounded bg-transparent"
          placeholder="seed artists (comma separated)"
          value={seeds}
          onChange={e => setSeeds(e.target.value)}
        />
        <input
          className="border p-3 rounded bg-transparent"
          placeholder="reference songs or albums"
          value={refs}
          onChange={e => setRefs(e.target.value)}
        />
        <button
          onClick={dig}
          className="bg-white text-black font-bold p-3 rounded"
        >
          dig
        </button>
      </div>

      {loading && <p className="text-gray-400">digging...</p>}

      <div className="flex flex-col gap-6 mt-6">
        {results.map((a, i) => (
          <div key={i} className="border rounded p-5">
            <h2 className="text-xl font-bold">{a.name}</h2>
            <p className="text-sm text-gray-400">{a.genre} · {a.vibe}</p>
            <p className="mt-2 text-sm">{a.why}</p>
            <div className="mt-3">
              <p className="text-xs text-gray-500 uppercase mb-1">tracks</p>
              {a.tracks.map((t, j) => (
                <p key={j} className="text-sm">{t.title} — {t.year}</p>
              ))}
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-500 uppercase mb-1">albums</p>
              {a.albums.map((al, j) => (
                <p key={j} className="text-sm">{al.title} — {al.year}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}