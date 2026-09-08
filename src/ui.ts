import type { City, Config, Unit } from "./storage.ts";

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
  console.log(LINE);
  console.log("         WEATHER CLI");
  console.log(LINE);
}

export function printMenu(config: Config): void {
  printHeader();
  console.log("  1. Clima de ciudad default");
  console.log(`  2. Clima de todas las ciudades (${config.cities.length})`);
  console.log("  3. Buscar y agregar ciudad");
  console.log("  4. Eliminar ciudad");
  console.log("  5. Establecer ciudad default");
  console.log(`  8. Ajustes (${unitSymbol(config.unit)})`);
  console.log("  9. Salir");
  console.log(LINE);
}

export function printMessage(text: string): void {
  console.log(`  ${text}`);
}

export function listCities(cities: City[]): void {
  cities.forEach((city, i) => console.log(`  ${i + 1}. ${formatLocation(city)}`));
}
