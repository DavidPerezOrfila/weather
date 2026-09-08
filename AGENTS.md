# AGENTS.md

## Project

Weather CLI (course exercise). Console app: prompt a city, fetch weather, and produce an executable binary. Spanish UI (menu labels, API `language=es`).

## Engineering principles

- Do not preserve backward compatibility. Remove obsolete paths instead of adding compatibility layers, fallbacks, or migrations.
- Choose the simplest implementation that fully meets the current requirements. Avoid speculative abstractions, configuration, and indirection.
- Grow the system in layers. Start from the smallest version that works end to end, and add each new capability on top of a product that already works. Never trade a working product for unfinished complexity.
- Keep components modular and concerns clearly separated.
- Prefer established, well-maintained libraries when they reduce overall complexity or improve reliability. Do not reimplement common functionality without a clear reason.
- Lean on the dependencies already in the project before writing your own implementation or adding packages. Do not assume a library lacks a capability without checking its documentation and types.
- Make architectural decisions for the long term. Do not accept a stopgap that only works for now and is meant to be replaced later.

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

## Clean code

- Reply short and concise.
- Code in English — identifiers, functions, classes, everything.
- Comments in Spanish, only when they add value.
- Prioritize simplicity: readable code, small functions, no duplication (DRY).
- Follow SOLID principles where applicable.
- No superfluous comments — self-documenting code where possible.
- No magic: avoid cryptic expressions, prefer clarity.
- Good security practices when relevant.

## Line endings (CRLF vs LF)

- `npm run lint` enforces **LF** line endings (`linebreak-style`); CRLF files fail with hundreds of `Expected linebreaks to be 'LF'` errors.
- The repo stores LF: `.gitattributes` has `* text=auto eol=lf`. Never commit CRLF.
- On Windows, `core.autocrlf=true` (or OneDrive placeholders) can leave CRLF in the working tree for files checked out before normalization. Git may report them clean while eslint fails — the lint error is the source of truth.
- Always write/edit files with LF endings. If `npm run lint` suddenly fails with CRLF errors, normalize the working tree back to LF instead of committing CRLF (e.g. `git add --renormalize .` in a dedicated commit, or convert the affected files to LF).
