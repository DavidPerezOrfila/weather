import type { Config } from "../types/Config.ts";
import type { PromptFn } from "../presentation/input.ts";
import { pickCity } from "../presentation/input.ts";
import { printSuccess } from "../presentation/output.ts";
import { deleteCity } from "../storage/citiesStorage.ts";

export async function removeCity(rl: PromptFn, config: Config): Promise<void> {
  const city = await pickCity(rl, config, "eliminar");
  if (city === null) return;
  deleteCity(config, city.name);
  printSuccess(`${city.name} eliminada.`);
}
