import type { Config } from "./types/Config.ts";
import type { MenuOption } from "./types/MenuOption.ts";
import { createPrompt } from "./presentation/input.ts";
import type { PromptFn } from "./presentation/input.ts";
import { printHeader, printMenu } from "./presentation/menu.ts";
import { printError, printSuccess } from "./presentation/output.ts";
import { loadConfig, saveConfig, toggleUnit } from "./storage/settingsStorage.ts";
import { unitSymbol } from "./utils/format.ts";
import { getDefaultWeather } from "./actions/getWeather.ts";
import { listCitiesWeather } from "./actions/listCities.ts";
import { addCity } from "./actions/addCity.ts";
import { removeCity } from "./actions/removeCity.ts";
import { setDefaultCity } from "./actions/setDefaultCity.ts";
import { getForecast } from "./actions/getForecast.ts";

async function runOption(option: string, rl: PromptFn, config: Config): Promise<boolean> {
  switch (option as MenuOption) {
    case "1":
      await getDefaultWeather(config);
      break;
    case "2":
      await listCitiesWeather(config);
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
    case "6":
      await getForecast(rl, config);
      break;
    case "8":
      toggleUnit(config);
      printSuccess(`Unidad: ${unitSymbol(config.unit)}`);
      break;
    case "9":
      return false;
    default:
      printError("Opción inválida.");
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
