import type { City } from "../types/City.ts";
import type { Unit } from "../types/Config.ts";

export function unitSymbol(unit: Unit): string {
  return unit === "f" ? "°F" : "°C";
}

export function formatLocation({ name, country, admin1 }: City): string {
  const region = admin1 === undefined ? "" : `, ${admin1}`;
  return `${name}${region} (${country})`;
}
