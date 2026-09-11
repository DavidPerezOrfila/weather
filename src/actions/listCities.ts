import type { Config } from "../types/Config.ts";
import { requireCities } from "../presentation/input.ts";
import { getWeather } from "./getWeather.ts";

export async function listCitiesWeather(config: Config): Promise<void> {
  if (!requireCities(config)) return;
  for (const city of config.cities) {
    await getWeather(city, config.unit);
  }
}
