import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

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

    return Response.json(data)

  } catch (err) {
    console.error("API error:", err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}