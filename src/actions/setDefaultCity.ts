import type { Config } from "../types/Config.ts";
import type { PromptFn } from "../presentation/input.ts";
import { pickCity } from "../presentation/input.ts";
import { printSuccess } from "../presentation/output.ts";

export async function setDefaultCity(rl: PromptFn, config: Config): Promise<void> {
  const city = await pickCity(rl, config, "establecer como default");
  if (city === null) return;
  config.defaultCity = city.name;
  printSuccess(`Ciudad default: ${city.name}`);
}
