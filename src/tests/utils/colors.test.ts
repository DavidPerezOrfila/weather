import { describe, expect, test } from "bun:test";
import { BOLD, paint, RESET } from "../../utils/colors.ts";

describe("paint", () => {
  test("envuelve el texto con el código de color y reset", () => {
    const colored = paint("hola", BOLD);
    expect(colored).toBe(`${BOLD}hola${RESET}`);
  });
});
