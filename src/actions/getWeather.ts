import type { City } from "../types/City.ts";
import type { Config, Unit } from "../types/Config.ts";
import { fetchTemperature } from "../api/weather.ts";
import { printInfo, printWeather } from "../presentation/output.ts";
import { findCity } from "../storage/citiesStorage.ts";

export async function getWeather(city: City, unit: Unit): Promise<void> {
  const temp = await fetchTemperature(city, unit);
  printWeather(city, temp, unit);
}

export async function getDefaultWeather(config: Config): Promise<void> {
  const city = config.defaultCity === null ? undefined : findCity(config, config.defaultCity);
  if (city === undefined) {
    printInfo("No hay ciudad default. Usa la opción 5 para establecerla.");
    return;
  }
  await getWeather(city, config.unit);
}
