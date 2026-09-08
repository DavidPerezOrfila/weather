import type { City, Config, Unit } from "./storage.ts";
import {
  BLUE,
  BOLD,
  GRAY,
  GREEN,
  PEACH,
  RED,
  SAPPHIRE,
  TEAL,
  TEXT,
  YELLOW,
  paint,
} from "./colors.ts";

const LINE = "═".repeat(40);

export function unitSymbol(unit: Unit): string {
  return unit === "f" ? "°F" : "°C";
}

export function formatLocation({ name, country, admin1 }: City): string {
  const region = admin1 === undefined ? "" : `, ${admin1}`;
  return `${name}${region} (${country})`;
}

export function printHeader(): void {
  console.clear();
  console.log(paint(LINE, GRAY));
  console.log(paint("         WEATHER CLI", `${BOLD}${BLUE}`));
  console.log(paint(LINE, GRAY));
}

export function printMenu(config: Config): void {
  printHeader();
  console.log(paint("  1. Clima de ciudad default", SAPPHIRE));
  console.log(paint(`  2. Clima de todas las ciudades (${config.cities.length})`, TEAL));
  console.log(paint("  3. Buscar y agregar ciudad", GREEN));
  console.log(paint("  4. Eliminar ciudad", RED));
  console.log(paint("  5. Establecer ciudad default", PEACH));
  console.log(paint(`  8. Ajustes (${unitSymbol(config.unit)})`, YELLOW));
  console.log(paint("  9. Salir", GRAY));
  console.log(paint(LINE, GRAY));
}

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

export function listCities(cities: City[]): void {
  cities.forEach((city, i) => console.log(paint(`  ${i + 1}. ${formatLocation(city)}`, TEXT)));
}
