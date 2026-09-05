# AGENTS.md

## Project

Weather CLI (course exercise). Console app: prompt a city, fetch weather, produce an executable binary. Spanish UI (menu labels, API `language=es`).

## Commands

- Run: `bun run index.ts`
- Install deps: `bun install` (never npm/yarn — `bun.lock` is the lockfile)
- Compile to binary: `bun build --compile index.ts --outfile weather` (this is the project's end goal; output dir `out/` or `dist/` is gitignored)

No tests, no linter, no CI configured. Verify changes by running the CLI.

## Architecture

- Single entry: `index.ts` (currently a stub — build from here).
- Runtime is Bun, not Node. Use Bun APIs (`Bun.write`, `bun:sqlite`, etc.) when useful.
- Weather data flow is two sequential HTTP calls to OpenMeteo (no API key, no auth):
  1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1&language=es&format=json` → lat/lon
  2. Forecast: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`
- App must persist: default city, list of saved cities, temperature unit setting (menu option 8 shows °C as current setting). Choose storage location at implementation time.

## Conventions

- TypeScript strict mode; `verbatimModuleSyntax` — use `import type` for type-only imports.
- Comments in Spanish, identifiers in English (per user's global rules).
