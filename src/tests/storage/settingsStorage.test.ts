import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadConfig, saveConfig, toggleUnit } from "../../storage/settingsStorage.ts";
import { makeCity, makeConfig } from "../helpers/helpers.ts";

const dirs: string[] = [];

async function tempConfigPath(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "weather-test-"));
  dirs.push(dir);
  return join(dir, "config.json");
}

afterEach(async () => {
  await Promise.all(dirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe("loadConfig", () => {
  test("devuelve valores por defecto si el archivo no existe", async () => {
    const config = await loadConfig(await tempConfigPath());
    expect(config).toEqual({ cities: [], defaultCity: null, unit: "c" });
  });

  test("completa los campos faltantes y normaliza unidad inválida", async () => {
    const path = await tempConfigPath();
    await Bun.write(path, JSON.stringify({ unit: "x" }));
    expect(await loadConfig(path)).toEqual({ cities: [], defaultCity: null, unit: "c" });
  });

  test("conserva fahrenheit", async () => {
    const path = await tempConfigPath();
    await Bun.write(path, JSON.stringify({ unit: "f" }));
    expect((await loadConfig(path)).unit).toBe("f");
  });

  test("hace roundtrip de la config guardada", async () => {
    const path = await tempConfigPath();
    const config = makeConfig({ cities: [makeCity()], defaultCity: "Ottawa", unit: "f" });
    await saveConfig(config, path);
    expect(await loadConfig(path)).toEqual(config);
  });
});

describe("toggleUnit", () => {
  test("alterna c → f → c", () => {
    const config = makeConfig({ unit: "c" });
    toggleUnit(config);
    expect(config.unit).toBe("f");
    toggleUnit(config);
    expect(config.unit).toBe("c");
  });
});
