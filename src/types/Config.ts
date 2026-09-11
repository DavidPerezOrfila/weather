import type { City } from "./City.ts";

export type Unit = "c" | "f";

export interface Config {
  cities: City[];
  defaultCity: string | null;
  unit: Unit;
}
