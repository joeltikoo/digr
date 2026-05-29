import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function getLastfmData(artistName) {
  const key = process.env.LASTFM_API_KEY
  const base = "https://ws.audioscrobbler.com/2.0/"
  const enc = encodeURIComponent(artistName)

  try {
    const [infoRes, similarRes] = await Promise.all([
      fetch(`${base}?method=artist.getinfo&artist=${enc}&api_key=${key}&format=json`),
      fetch(`${base}?method=artist.getsimilar&artist=${enc}&api_key=${key}&format=json&limit=4`)
    ])

    const [infoData, similarData] = await Promise.all([
      infoRes.json(),
      similarRes.json()
    ])

    const listeners = parseInt(infoData.artist?.stats?.listeners || "0")
    const tags = infoData.artist?.tags?.tag?.map(t => t.name).slice(0, 4) || []
    const similar = similarData.similarartists?.artist?.map(a => a.name) || []

    // obscurity score: fewer listeners = more obscure
    let obscurity = "unknown"
    if (listeners > 0) {
      if (listeners < 10000) obscurity = "extremely underground"
      else if (listeners < 100000) obscurity = "very underground"
      else if (listeners < 500000) obscurity = "underground"
      else if (listeners < 2000000) obscurity = "somewhat niche"
      else obscurity = "mainstream"
    }

    return { listeners, tags, similar, obscurity }

  } catch {
    return { listeners: 0, tags: [], similar: [], obscurity: "unknown" }
  }
}

export async function POST(request) {
  try {
    const { vibe, seeds, refs } = await request.json()

    const prompt = [
      "You are a music expert. You must respond with ONLY a JSON object.",
      "Do not write any explanation, greeting, or text before or after the JSON.",
      "",
      "Vibe: " + (vibe || "not specified"),
      "Seed artists: " + (seeds || "not specified"),
      "Reference songs/albums: " + (refs || "not specified"),
      "",
      "Return this exact structure:",
      `{
  "artists": [
    {
      "name": "Artist Name",
      "genre": "specific genre",
      "vibe": "3-4 word descriptor",
      "why": "one sentence why this matches",
      "tracks": [
        { "title": "Track Name", "year": 2020 }
      ],
      "albums": [
        { "title": "Album Name", "year": 2021 }
      ]
    }
  ]
}`,
      "",
      "Rules:",
      "- 6 to 8 artists",
      "- underground and niche only, no mainstream",
      "- 2-3 tracks per artist",
      "- 1-2 albums per artist",
      "- return ONLY the JSON, nothing else"
    ].join("\n")

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }]
    })

    const text = completion.choices[0].message.content
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error("no JSON found in response")
    const data = JSON.parse(match[0])

    // enrich each artist with Last.fm data
    const enriched = await Promise.all(
      data.artists.map(async (artist) => {
        const lastfm = await getLastfmData(artist.name)
        return { ...artist, ...lastfm }
      })
    )

    return Response.json({ artists: enriched })

  } catch (err) {
    console.error("API error:", err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}