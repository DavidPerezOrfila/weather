import type { City } from "../types/City.ts";
import type { Config } from "../types/Config.ts";
import { printCityList, printError, printInfo } from "./output.ts";

// Prompt por eventos de stdin. node:readline y for-await sobre Bun.stdin.stream()
// fallan en Bun/Windows con stdin no-TTY (verificado empíricamente).
// EOF resuelve lo pendiente con null para salir limpio en pipes.
export type PromptFn = (text: string) => Promise<string | null>;

export function createPrompt(): PromptFn {
  const lines: string[] = [];
  const waiters: Array<(line: string | null) => void> = [];
  let buffer = "";
  let finished = false;

  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk: string) => {
    buffer += chunk;
    let newline = buffer.indexOf("\n");
    while (newline !== -1) {
      lines.push(buffer.slice(0, newline).replace(/\r$/, ""));
      buffer = buffer.slice(newline + 1);
      newline = buffer.indexOf("\n");
    }
    while (waiters.length > 0 && lines.length > 0) waiters.shift()!(lines.shift()!);
    if (finished) while (waiters.length > 0) waiters.shift()!(null);
  });
  process.stdin.on("end", () => {
    finished = true;
    if (buffer !== "") lines.push(buffer);
    while (waiters.length > 0) waiters.shift()!(lines.length > 0 ? lines.shift()! : null);
  });

  async function ask(text: string): Promise<string | null> {
    process.stdout.write(text);
    // Resolución síncrona si la línea ya está en cola (patrón verificado en Bun/Win)
    const line =
      lines.length > 0
        ? lines.shift()!
        : finished
          ? null
          : await new Promise<string | null>((resolve) => {
              waiters.push(resolve);
            });
    return line === null ? null : line.trim();
  }

  return ask;
}

export function requireCities(config: Config): boolean {
  if (config.cities.length === 0) {
    printInfo("No hay ciudades guardadas. Usa la opción 3 para agregar una.");
    return false;
  }
  return true;
}

export async function pickCity(rl: PromptFn, config: Config, action: string): Promise<City | null> {
  if (!requireCities(config)) return null;
  printCityList(config.cities);
  const answer = await rl(`  Número de ciudad a ${action} (vacío para cancelar): `);
  if (answer === null || answer === "") return null;
  const index = Number(answer) - 1;
  if (Number.isNaN(index) || index < 0 || index >= config.cities.length) {
    printError("Opción inválida.");
    return null;
  }
  return config.cities[index]!;
}
