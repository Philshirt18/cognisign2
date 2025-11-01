# Cognisight Web (Next.js)

A web-first prototype of the Cognisight speech-screening flow built with Next.js and React. The goal is to mirror the Streamlit experience while unlocking richer browser media capture and deployment flexibility.

## Features

- Three acquisition paths: demo clips, in-browser recording (MediaRecorder), and manual uploads.
- Audio preview + stubbed quality/model analysis via `/api/process-audio`.
- Modular React components ready to hook into the existing Python processing pipeline.

## Getting started

```bash
# from the repo root
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000.

### Demo clips

Place `.wav` or `.webm` samples in `public/demo/` to power the demo buttons. Two placeholder filenames are referenced:

- `frontend/public/demo/healthy.wav`
- `frontend/public/demo/higher-risk.wav`

### Connecting to the Python backend

1. Expose your current Streamlit/Python logic as a REST endpoint (e.g., FastAPI route `/api/process` that accepts audio files and returns QC + risk score JSON).
2. Update `src/lib/api.ts` to call that endpoint instead of the local stub.
3. Remove or adjust `src/app/api/process-audio/route.ts` once the real service is available.
4. Configure CORS on the backend if the frontend will run on a different domain.

## Project structure

```
frontend/
  public/           # static assets (add demo audio here)
  src/
    app/            # Next.js app router pages and API routes
    components/     # UI building blocks (recorder, summaries)
    lib/            # API client helpers
    types.ts        # Shared TypeScript types
```

## Browser support notes

- Media recording works best in Chromium-based browsers (Chrome, Edge, Brave). Safari 17+ has partial support; fallback messaging is displayed whenever recording is not available.
- The stub analysis endpoint generates deterministic but fake QC/score values. Replace it with the real model to obtain meaningful results.
