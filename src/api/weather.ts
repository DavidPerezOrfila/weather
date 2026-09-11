import type { City } from "../types/City.ts";
import type { Unit } from "../types/Config.ts";
import type { ForecastDay } from "../types/Weather.ts";
import { FORECAST_URL } from "../utils/constants.ts";

interface ForecastResponse {
  current?: { temperature_2m: number };
}

interface DailyForecastResponse {
  daily?: { time: string[]; temperature_2m_max: number[]; temperature_2m_min: number[] };
}

export async function fetchTemperature(city: City, unit: Unit): Promise<number> {
  const params = new URLSearchParams({
    latitude: city.latitude.toString(),
    longitude: city.longitude.toString(),
    current: "temperature_2m",
    ...(unit === "f" ? { temperature_unit: "fahrenheit" } : {}),
  });
  const data = (await (await fetch(`${FORECAST_URL}?${params}`)).json()) as ForecastResponse;
  if (data.current === undefined) {
    throw new Error(`Sin datos de clima para ${city.name}`);
  }
  return data.current.temperature_2m;
}

export async function fetchDailyForecast(city: City, unit: Unit): Promise<ForecastDay[]> {
  const params = new URLSearchParams({
    latitude: city.latitude.toString(),
    longitude: city.longitude.toString(),
    daily: "temperature_2m_max,temperature_2m_min",
    timezone: "auto",
    forecast_days: "7",
    ...(unit === "f" ? { temperature_unit: "fahrenheit" } : {}),
  });
  const data = (await (await fetch(`${FORECAST_URL}?${params}`)).json()) as DailyForecastResponse;
  const daily = data.daily;
  if (daily === undefined) {
    throw new Error(`Sin pronóstico para ${city.name}`);
  }
  return daily.time.map((date, i) => ({
    date,
    min: daily.temperature_2m_min[i]!,
    max: daily.temperature_2m_max[i]!,
  }));
}
