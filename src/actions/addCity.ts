import type { Config } from "../types/Config.ts";
import type { PromptFn } from "../presentation/input.ts";
import { searchCity } from "../api/geocoding.ts";
import { printError } from "../presentation/output.ts";
import { appendCity, hasCity } from "../storage/citiesStorage.ts";
import { getWeather } from "./getWeather.ts";

export async function addCity(rl: PromptFn, config: Config): Promise<void> {
  const query = await rl("  Ciudad a buscar: ");
  if (query === null || query === "") return;
  const city = await searchCity(query);
  if (city === null) {
    printError(`No se encontró "${query}".`);
    return;
  }
  if (hasCity(config, city.name)) {
    printError(`${city.name} ya está guardada.`);
    return;
  }
  appendCity(config, city);
  await getWeather(city, config.unit);
}
