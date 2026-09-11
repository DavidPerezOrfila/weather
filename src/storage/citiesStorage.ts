import type { City } from "../types/City.ts";
import type { Config } from "../types/Config.ts";

export function findCity(config: Config, name: string): City | undefined {
  return config.cities.find((city) => city.name === name);
}

export function hasCity(config: Config, name: string): boolean {
  return config.cities.some((city) => city.name === name);
}

export function appendCity(config: Config, city: City): void {
  config.cities.push(city);
}

export function deleteCity(config: Config, name: string): void {
  config.cities = config.cities.filter((city) => city.name !== name);
  if (config.defaultCity === name) config.defaultCity = null;
}
