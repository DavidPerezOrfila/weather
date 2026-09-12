import { spyOn } from "bun:test";
import type { City } from "../types/City.ts";
import type { Config } from "../types/Config.ts";

const originalFetch = globalThis.fetch;

export function makeCity(overrides: Partial<City> = {}): City {
  return {
    name: "Ottawa",
    country: "Canadá",
    admin1: "Ontario",
    latitude: 45.4,
    longitude: -75.7,
    ...overrides,
  };
}

export function makeConfig(overrides: Partial<Config> = {}): Config {
  return { cities: [], defaultCity: null, unit: "c", ...overrides };
}

export function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json" },
  });
}

// Enruta fetch por fragmento de URL: { "geocoding-api": {...}, "forecast": {...} }
export function stubFetch(routes: Record<string, unknown>): void {
  globalThis.fetch = (async (input: URL | Request | string) => {
    const url = String(input);
    const fragment = Object.keys(routes).find((key) => url.includes(key));
    if (fragment === undefined) throw new Error(`Sin stub de fetch para: ${url}`);
    return jsonResponse(routes[fragment]);
  }) as typeof fetch;
}

export function restoreFetch(): void {
  globalThis.fetch = originalFetch;
}

// Captura console.log en un array para poder afirmar sobre la salida
export function captureLog(): string[] {
  const lines: string[] = [];
  spyOn(console, "log").mockImplementation((...args: unknown[]) => {
    lines.push(args.map((arg) => String(arg)).join(" "));
  });
  return lines;
}
