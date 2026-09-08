import { homedir } from "node:os";
import { join } from "node:path";

// Ciudad guardada con sus coordenadas (evita re-geocodificar en cada consulta)
export interface City {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export type Unit = "c" | "f";

export interface Config {
  cities: City[];
  defaultCity: string | null;
  unit: Unit;
}

const CONFIG_PATH = join(homedir(), ".weather-cli.json");

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
