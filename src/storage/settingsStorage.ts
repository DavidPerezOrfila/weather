import type { Config } from "../types/Config.ts";
import { CONFIG_PATH } from "../utils/constants.ts";

// path inyectable para tests; en producción usa CONFIG_PATH
export async function loadConfig(path: string = CONFIG_PATH): Promise<Config> {
  const file = Bun.file(path);
  if (!(await file.exists())) {
    return { cities: [], defaultCity: null, unit: "c" };
  }
  const raw = (await file.json()) as Partial<Config>;
  return {
    cities: raw.cities ?? [],
    defaultCity: raw.defaultCity ?? null,
    unit: raw.unit === "f" ? "f" : "c",
  };
}

export async function saveConfig(config: Config, path: string = CONFIG_PATH): Promise<void> {
  await Bun.write(path, JSON.stringify(config, null, 2));
}

export function toggleUnit(config: Config): void {
  config.unit = config.unit === "c" ? "f" : "c";
}
