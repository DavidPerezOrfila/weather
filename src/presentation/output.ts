import type { City } from "../types/City.ts";
import type { Unit } from "../types/Config.ts";
import type { ForecastDay } from "../types/Weather.ts";
import { formatLocation, unitSymbol } from "../utils/format.ts";
import { GRAY, GREEN, RED, TEXT, YELLOW, paint } from "../utils/colors.ts";

export function printSuccess(text: string): void {
  console.log(paint(`  ${text}`, GREEN));
}

export function printError(text: string): void {
  console.log(paint(`  ${text}`, RED));
}

export function printInfo(text: string): void {
  console.log(paint(`  ${text}`, TEXT));
}

export function printWeather(city: City, temp: number, unit: Unit): void {
  console.log(paint(`  ${formatLocation(city)}: `, TEXT) + paint(`${temp} ${unitSymbol(unit)}`, YELLOW));
}

// Fechas "YYYY-MM-DD" de la API: formatear en UTC para no desplazar el día
const dateFormat = new Intl.DateTimeFormat("es", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function printForecast(city: City, days: ForecastDay[], unit: Unit): void {
  console.log(paint(`  Pronóstico de ${formatLocation(city)}`, TEXT));
  for (const day of days) {
    const date = dateFormat.format(new Date(day.date));
    console.log(
      paint(`  ${date}: `, GRAY) + paint(`${day.min} / ${day.max} ${unitSymbol(unit)}`, YELLOW),
    );
  }
}

export function printCityList(cities: City[]): void {
  cities.forEach((city, i) => console.log(paint(`  ${i + 1}. ${formatLocation(city)}`, TEXT)));
}
