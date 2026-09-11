import type { City, Unit } from "./storage.ts";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

interface GeocodeResponse {
  results?: City[];
}

interface ForecastResponse {
  current?: { temperature_2m: number };
}

interface DailyForecastResponse {
  daily?: { time: string[]; temperature_2m_max: number[]; temperature_2m_min: number[] };
}

export interface ForecastDay {
  date: string;
  min: number;
  max: number;
}

export async function searchCity(query: string): Promise<City | null> {
  const params = new URLSearchParams({ name: query, count: "1", language: "es", format: "json" });
  const data = (await (await fetch(`${GEOCODING_URL}?${params}`)).json()) as GeocodeResponse;
  const result = data.results?.[0];
  // La API devuelve muchos campos extra; persistir solo los que la app usa
  if (result === undefined) return null;
  return {
    name: result.name,
    country: result.country,
    admin1: result.admin1,
    latitude: result.latitude,
    longitude: result.longitude,
  };
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
