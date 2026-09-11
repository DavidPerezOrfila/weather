import type { Config } from "../types/Config.ts";
import { CONFIG_PATH } from "../utils/constants.ts";

export async function loadConfig(): Promise<Config> {
  const file = Bun.file(CONFIG_PATH);
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

export async function saveConfig(config: Config): Promise<void> {
  await Bun.write(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export function toggleUnit(config: Config): void {
  config.unit = config.unit === "c" ? "f" : "c";
}
