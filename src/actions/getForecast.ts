import type { Config } from "../types/Config.ts";
import type { PromptFn } from "../presentation/input.ts";
import { pickCity } from "../presentation/input.ts";
import { fetchDailyForecast } from "../api/weather.ts";
import { printForecast } from "../presentation/output.ts";

export async function getForecast(rl: PromptFn, config: Config): Promise<void> {
  const city = await pickCity(rl, config, "ver pronóstico");
  if (city === null) return;
  const days = await fetchDailyForecast(city, config.unit);
  printForecast(city, days, config.unit);
}
