import type { City } from "../types/City.ts";
import { GEOCODING_URL } from "../utils/constants.ts";

interface GeocodeResponse {
  results?: City[];
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
