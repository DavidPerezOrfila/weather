import { loadConfig, saveConfig } from "./src/storage.ts";
import type { City, Config } from "./src/storage.ts";
import { fetchTemperature, searchCity } from "./src/openmeteo.ts";
import {
  listCities,
  printHeader,
  printMenu,
  printMessage,
  unitSymbol,
  formatLocation,
} from "./src/ui.ts";
import type { PromptFn } from "./src/prompt.ts";
import { createPrompt } from "./src/prompt.ts";

async function printWeather(city: City, unit: Config["unit"]): Promise<void> {
  const temp = await fetchTemperature(city, unit);
  printMessage(`${formatLocation(city)}: ${temp} ${unitSymbol(unit)}`);
}

function requireCities(config: Config): boolean {
  if (config.cities.length === 0) {
    printMessage("No hay ciudades guardadas. Usa la opción 3 para agregar una.");
    return false;
  }
  return true;
}

async function pickCity(rl: PromptFn, config: Config, action: string): Promise<City | null> {
  if (!requireCities(config)) return null;
  listCities(config.cities);
  const answer = await rl(`  Número de ciudad a ${action} (vacío para cancelar): `);
  if (answer === null || answer === "") return null;
  const index = Number(answer) - 1;
  if (Number.isNaN(index) || index < 0 || index >= config.cities.length) {
    printMessage("Opción inválida.");
    return null;
  }
  return config.cities[index]!;
}

async function showDefaultWeather(config: Config): Promise<void> {
  const city = config.cities.find((c) => c.name === config.defaultCity);
  if (city === undefined) {
    printMessage("No hay ciudad default. Usa la opción 5 para establecerla.");
    return;
  }
  await printWeather(city, config.unit);
}

async function showAllWeather(config: Config): Promise<void> {
  if (!requireCities(config)) return;
  for (const city of config.cities) {
    await printWeather(city, config.unit);
  }
}

async function addCity(rl: PromptFn, config: Config): Promise<void> {
  const query = await rl("  Ciudad a buscar: ");
  if (query === null || query === "") return;
  const city = await searchCity(query);
  if (city === null) {
    printMessage(`No se encontró "${query}".`);
    return;
  }
  if (config.cities.some((c) => c.name === city.name)) {
    printMessage(`${city.name} ya está guardada.`);
    return;
  }
  config.cities.push(city);
  await printWeather(city, config.unit);
}

async function removeCity(rl: PromptFn, config: Config): Promise<void> {
  const city = await pickCity(rl, config, "eliminar");
  if (city === null) return;
  config.cities = config.cities.filter((c) => c.name !== city.name);
  if (config.defaultCity === city.name) config.defaultCity = null;
  printMessage(`${city.name} eliminada.`);
}

async function setDefaultCity(rl: PromptFn, config: Config): Promise<void> {
  const city = await pickCity(rl, config, "establecer como default");
  if (city === null) return;
  config.defaultCity = city.name;
  printMessage(`Ciudad default: ${city.name}`);
}

function toggleUnit(config: Config): void {
  config.unit = config.unit === "c" ? "f" : "c";
  printMessage(`Unidad: ${unitSymbol(config.unit)}`);
}

async function runOption(option: string, rl: PromptFn, config: Config): Promise<boolean> {
  switch (option) {
    case "1":
      await showDefaultWeather(config);
      break;
    case "2":
      await showAllWeather(config);
      break;
    case "3":
      await addCity(rl, config);
      break;
    case "4":
      await removeCity(rl, config);
      break;
    case "5":
      await setDefaultCity(rl, config);
      break;
    case "8":
      toggleUnit(config);
      break;
    case "9":
      return false;
    default:
      printMessage("Opción inválida.");
  }
  return true;
}

async function main(): Promise<void> {
  // Adjuntar listeners de stdin ANTES del primer await: si no, el primer chunk se pierde
  const rl = createPrompt();
  const config = await loadConfig();

  let running = true;
  while (running) {
    printMenu(config);
    const option = await rl("  Selecciona una opción: ");
    // EOF en stdin: salir sin colgar
    if (option === null) break;
    printHeader();
    running = await runOption(option, rl, config);
    if (running) {
      // Guardar tras cada acción: un Ctrl+C no debe perder cambios
      await saveConfig(config);
      const cont = await rl("  Presiona Enter para continuar...");
      if (cont === null) break;
    }
  }

  await saveConfig(config);
  // exit explícito: el handle de stdin en TTY nunca emite "end" y cuelga el proceso
  process.exit(0);
}

await main().catch((error: unknown) => {
  console.error("Error:", error);
  process.exit(1);
});
