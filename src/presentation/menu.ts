import type { Config } from "../types/Config.ts";
import { unitSymbol } from "../utils/format.ts";
import { LINE } from "../utils/constants.ts";
import { BLUE, BOLD, GRAY, GREEN, PEACH, RED, SAPPHIRE, TEAL, YELLOW, paint } from "../utils/colors.ts";

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
  console.log(paint("  6. Pronóstico 7 días", BLUE));
  console.log(paint(`  8. Ajustes (${unitSymbol(config.unit)})`, YELLOW));
  console.log(paint("  9. Salir", GRAY));
  console.log(paint(LINE, GRAY));
}
