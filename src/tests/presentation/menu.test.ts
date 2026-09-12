import { afterEach, describe, expect, mock, test } from "bun:test";
import { printHeader, printMenu } from "../../presentation/menu.ts";
import { captureLog, makeCity, makeConfig } from "../helpers/helpers.ts";

afterEach(() => {
  mock.restore();
});

describe("printMenu", () => {
  test("imprime las 9 opciones y la unidad actual", () => {
    const lines = captureLog();
    printMenu(makeConfig({ cities: [makeCity()], unit: "f" }));
    const output = lines.join("\n");
    expect(output).toContain("1. Clima de ciudad default");
    expect(output).toContain("2. Clima de todas las ciudades (1)");
    expect(output).toContain("3. Buscar y agregar ciudad");
    expect(output).toContain("4. Eliminar ciudad");
    expect(output).toContain("5. Establecer ciudad default");
    expect(output).toContain("6. Pronóstico 7 días");
    expect(output).toContain("8. Ajustes (°F)");
    expect(output).toContain("9. Salir");
  });
});

describe("printHeader", () => {
  test("imprime el título de la app", () => {
    const lines = captureLog();
    printHeader();
    expect(lines.join("\n")).toContain("WEATHER CLI");
  });
});
