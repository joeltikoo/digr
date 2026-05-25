# DIGR

Find underground and niche music you've never heard of.

Describe a vibe, drop some artists you already like, and DIGR uses AI to surface niche artist recommendations the algorithm never shows you — with tracks and albums to start with.

**Live at: [digrai.vercel.app](https://digrai.vercel.app)**

---

## Features

- Describe a vibe in plain text and get matched underground artists
- Drop seed artists or reference songs/albums for more precise results
- Get track and album recommendations for each artist
- Clean, minimal UI — no account needed, free to use

## Tech Stack

- **Next.js** — frontend and API routes
- **Tailwind CSS** — styling
- **Groq API** (Llama 3.3 70b) — AI recommendations engine
- **Vercel** — deployment

## Running Locally

**1. Clone the repo**
```bash
git clone https://github.com/joeltikoo/digr.git
cd digr
```

**2. Install dependencies**
```bash
npm install
```

**3. Add your API key**

Create a `.env.local` file in the root:
```
GROQ_API_KEY=your_key_here
```

Get a free Groq API key at [console.groq.com](https://console.groq.com)

**4. Run the dev server**
```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000)

## Contributing

Contributions are welcome. Check the [Issues](https://github.com/joeltikoo/digr/issues) tab for open tasks and read [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.

## License

MIT
