import { afterEach, describe, expect, mock, test } from "bun:test";
import { pickCity, requireCities } from "../../presentation/input.ts";
import { captureLog, makeCity, makeConfig } from "../helpers/helpers.ts";

const neverAsk = async (): Promise<string | null> => null;

afterEach(() => {
  mock.restore();
});

describe("requireCities", () => {
  test("false y aviso cuando no hay ciudades", () => {
    const lines = captureLog();
    expect(requireCities(makeConfig())).toBe(false);
    expect(lines.join("\n")).toContain("No hay ciudades guardadas");
  });

  test("true cuando hay al menos una ciudad", () => {
    expect(requireCities(makeConfig({ cities: [makeCity()] }))).toBe(true);
  });
});

describe("pickCity", () => {
  test("devuelve null si no hay ciudades", async () => {
    captureLog();
    expect(await pickCity(neverAsk, makeConfig(), "eliminar")).toBeNull();
  });

  test("devuelve la ciudad por número (1-based)", async () => {
    captureLog();
    const config = makeConfig({ cities: [makeCity({ name: "Lima" }), makeCity({ name: "Bogotá" })] });
    expect((await pickCity(async () => "2", config, "eliminar"))?.name).toBe("Bogotá");
  });

  test("devuelve null si la respuesta está vacía", async () => {
    captureLog();
    const config = makeConfig({ cities: [makeCity()] });
    expect(await pickCity(async () => "", config, "eliminar")).toBeNull();
  });

  test("devuelve null y avisa con número fuera de rango", async () => {
    const lines = captureLog();
    const config = makeConfig({ cities: [makeCity()] });
    expect(await pickCity(async () => "9", config, "eliminar")).toBeNull();
    expect(lines.join("\n")).toContain("Opción inválida");
  });

  test("devuelve null si el prompt devuelve null (EOF)", async () => {
    captureLog();
    const config = makeConfig({ cities: [makeCity()] });
    expect(await pickCity(neverAsk, config, "eliminar")).toBeNull();
  });
});
