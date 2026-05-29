# Contributing to DIGR

Thanks for your interest in contributing. DIGR is a free, open source underground music discovery tool built with Next.js and Groq.

## Getting Started

1. Fork the repo
2. Clone your fork
   ```bash
   git clone https://github.com/joeltikoo/digr.git
   cd digr
   ```
3. Install dependencies
   ```bash
   npm install
   ```
4. Create your `.env.local` file in the root:
   ```
   GROQ_API_KEY=your_key_here
   ```
   Get a free Groq API key at console.groq.com

5. Run the dev server
   ```bash
   npm run dev
   ```
   Open `localhost:3000`

## How to Contribute

1. Pick an open issue or suggest one
2. Create a new branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Commit with a clear message
   ```bash
   git commit -m "add: your feature description"
   ```
5. Push and open a pull request against `main`

## What to Work On

Check the Issues tab for open tasks. Good first issues are labeled `good first issue`. Some areas that need work:

- **API enrichment** — Last.fm, Spotify search links
- **UI improvements** — skeletons, mobile layout, animations
- **Performance** — caching, rate limiting
- **Testing** — API route tests
- **Features** — search history, share button, obscurity scores

## Guidelines

- Keep PRs focused — one feature or fix per PR
- Don't break the existing UI without discussion
- Keep API keys out of the code, use `.env.local`
- If you're adding a new API integration, document the required env variables in the PR description

## Questions

Open an issue and tag it `question`.
