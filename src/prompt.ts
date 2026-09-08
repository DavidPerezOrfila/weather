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
