'use client'

import { useState, useEffect } from 'react'

function SkeletonCard() {
  return (
    <div className="border rounded-lg p-5 animate-pulse" style={{borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)'}}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="h-5 rounded w-36 mb-2" style={{backgroundColor: 'var(--color-border)'}}></div>
          <div className="h-3 rounded w-24" style={{backgroundColor: 'var(--color-border)'}}></div>
        </div>
        <div className="h-6 rounded w-20" style={{backgroundColor: 'var(--color-border)'}}></div>
      </div>
      <div className="h-3 rounded w-full mb-2" style={{backgroundColor: 'var(--color-border)'}}></div>
      <div className="h-3 rounded w-3/4 mb-6" style={{backgroundColor: 'var(--color-border)'}}></div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="h-2 rounded w-12 mb-3" style={{backgroundColor: 'var(--color-border)'}}></div>
          <div className="h-3 rounded w-full mb-2" style={{backgroundColor: 'var(--color-border)'}}></div>
          <div className="h-3 rounded w-4/5 mb-2" style={{backgroundColor: 'var(--color-border)'}}></div>
          <div className="h-3 rounded w-3/5" style={{backgroundColor: 'var(--color-border)'}}></div>
        </div>
        <div>
          <div className="h-2 rounded w-12 mb-3" style={{backgroundColor: 'var(--color-border)'}}></div>
          <div className="h-3 rounded w-full mb-2" style={{backgroundColor: 'var(--color-border)'}}></div>
          <div className="h-3 rounded w-4/5" style={{backgroundColor: 'var(--color-border)'}}></div>
        </div>
      </div>
    </div>
  )
}

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="text-sm border rounded px-3 py-1.5 transition flex items-center gap-2 link-hover"
      style={{color: 'var(--color-muted)', borderColor: 'var(--color-border)'}}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}

export default function Home() {
  const [theme, setTheme] = useState('dark')
  const [vibe, setVibe] = useState('')
  const [seeds, setSeeds] = useState('')
  const [refs, setRefs] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('digr-theme')
    if (saved) setTheme(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('digr-theme', theme)
    if (theme === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
  }, [theme])

  function toggleTheme() {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  async function dig() {
    if (!vibe && !seeds && !refs) return
    setLoading(true)
    setResults([])
    setError('')
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vibe, seeds, refs })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResults(data.artists)
    } catch (err) {
      setError('something went wrong, try again')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen" style={{backgroundColor: 'var(--color-bg)', color: 'var(--color-text)'}}>
      {/* NAV */}
      <nav className="border-b px-6 py-4 flex justify-between items-center" style={{borderColor: 'var(--color-border)'}}>
        <span className="font-bold text-lg tracking-tight">DIGR</span>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/joeltikoo/digr"
            target="_blank"
            className="text-sm transition"
            style={{color: 'var(--color-muted)'}}
          >
            GitHub
          </a>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-2xl mx-auto px-6 pt-20 pb-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          find music you&apos;ve never heard of
        </h1>
        <p className="text-lg" style={{color: 'var(--color-muted)'}}>
          describe a vibe, drop some artists you like — DIGR finds underground artists the algorithm never shows you
        </p>
      </section>

      {/* FORM */}
      <section className="max-w-2xl mx-auto px-6 pb-16">
        <div className="flex flex-col gap-3">
          <input
            className="border rounded-lg p-4 text-sm"
            style={{backgroundColor: 'var(--color-input-bg)', borderColor: 'var(--color-input-border)', color: 'var(--color-text)'}}
            placeholder="describe the vibe... (e.g. dark, lo-fi, paranoid late night energy)"
            value={vibe}
            onChange={e => setVibe(e.target.value)}
          />
          <input
            className="border rounded-lg p-4 text-sm"
            style={{backgroundColor: 'var(--color-input-bg)', borderColor: 'var(--color-input-border)', color: 'var(--color-text)'}}
            placeholder="artists you already like (comma separated)"
            value={seeds}
            onChange={e => setSeeds(e.target.value)}
          />
          <input
            className="border rounded-lg p-4 text-sm"
            style={{backgroundColor: 'var(--color-input-bg)', borderColor: 'var(--color-input-border)', color: 'var(--color-text)'}}
            placeholder="reference songs or albums (optional)"
            value={refs}
            onChange={e => setRefs(e.target.value)}
          />
          <button
            onClick={dig}
            disabled={loading || (!vibe && !seeds && !refs)}
            className="font-bold py-4 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
            style={{backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)'}}
          >
            {loading ? 'digging...' : results.length > 0 ? 'dig again' : 'dig'}
          </button>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>

        {/* SKELETONS */}
        {loading && (
          <div className="mt-10 flex flex-col gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* RESULTS */}
        {results.length > 0 && (
          <div className="mt-10 flex flex-col gap-5">
            <p className="text-sm" style={{color: 'var(--color-muted)'}}>{results.length} artists found</p>
            {results.map((a, i) => (
              <div key={i} className="border rounded-lg p-5 transition card-hover" style={{borderColor: 'var(--color-border)'}}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="font-bold text-lg">{a.name}</h2>
                    <p className="text-sm" style={{color: 'var(--color-muted)'}}>{a.genre}</p>
                  </div>
                  <span className="text-xs border px-2 py-1 rounded" style={{color: 'var(--color-muted)', borderColor: 'var(--color-border)'}}>
                    {a.vibe}
                  </span>
                </div>

                <p className="text-sm mb-3" style={{color: 'var(--color-muted-strong)'}}>{a.why}</p>

                {a.tags?.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-3">
                    {a.tags.map((tag, j) => (
                      <span key={j} className="text-xs border px-2 py-1 rounded" style={{color: 'var(--color-muted)', borderColor: 'var(--color-border)'}}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {a.obscurity && (
                  <p className="text-xs mb-1" style={{color: 'var(--color-muted-strong)'}}>
                    obscurity: <span className="opacity-80">{a.obscurity}</span>
                    {a.listeners > 0 && (
                      <span className="ml-2">({a.listeners.toLocaleString()} listeners)</span>
                    )}
                  </p>
                )}

                {a.similar?.length > 0 && (
                  <p className="text-xs mb-4" style={{color: 'var(--color-muted-strong)'}}>
                    similar: <span className="opacity-80">{a.similar.join(', ')}</span>
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-2" style={{color: 'var(--color-muted-strong)'}}>tracks</p>
                    {a.tracks.map((t, j) => (
                      <p key={j} className="text-sm">
                        {t.title}
                        <span className="ml-2" style={{color: 'var(--color-muted-strong)'}}>{t.year}</span>
                      </p>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-2" style={{color: 'var(--color-muted-strong)'}}>albums</p>
                    {a.albums.map((al, j) => (
                      <p key={j} className="text-sm">
                        {al.title}
                        <span className="ml-2" style={{color: 'var(--color-muted-strong)'}}>{al.year}</span>
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
      <section className="border-t" style={{borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)'}}>
        <div className="max-w-2xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-10 text-center">how it works</h2>
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl mb-3">01</div>
              <p className="text-sm" style={{color: 'var(--color-muted)'}}>describe the vibe or drop artists you already like</p>
            </div>
            <div>
              <div className="text-3xl mb-3">02</div>
              <p className="text-sm" style={{color: 'var(--color-muted)'}}>AI digs through underground artists to find your match</p>
            </div>
            <div>
              <div className="text-3xl mb-3">03</div>
              <p className="text-sm" style={{color: 'var(--color-muted)'}}>get niche recs with tracks and albums to start with</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t px-6 py-6 flex justify-between items-center text-sm" style={{borderColor: 'var(--color-border)'}}>
        <span style={{color: 'var(--color-muted-strong)'}}>DIGR — free to use</span>
        <a
          href="https://github.com/joeltikoo/digr"
          target="_blank"
          className="transition"
          style={{color: 'var(--color-muted-strong)'}}
        >
          open source
        </a>
      </footer>
    </main>
  )
}
