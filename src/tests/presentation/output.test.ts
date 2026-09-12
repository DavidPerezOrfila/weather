import { afterEach, describe, expect, mock, test } from "bun:test";
import type { City } from "../../types/City.ts";
import type { ForecastDay } from "../../types/Weather.ts";
import { printCityList, printError, printForecast, printInfo, printSuccess, printWeather } from "../../presentation/output.ts";
import { captureLog, makeCity } from "../helpers/helpers.ts";

afterEach(() => {
  mock.restore();
});

describe("printSuccess / printError / printInfo", () => {
  test("imprimen el texto con color", () => {
    const lines = captureLog();
    printSuccess("Guardado");
    printError("Falló");
    printInfo("Hola");
    const output = lines.join("\n");
    expect(output).toContain("Guardado");
    expect(output).toContain("Falló");
    expect(output).toContain("Hola");
  });
});

describe("printWeather", () => {
  test("imprime ubicación, temperatura y unidad", () => {
    const lines = captureLog();
    printWeather(makeCity(), 20, "c");
    const output = lines.join("\n");
    expect(output).toContain("Ottawa, Ontario (Canadá):");
    expect(output).toContain("20 °C");
  });
});

describe("printForecast", () => {
  test("imprime título y cada día con min/max", () => {
    const lines = captureLog();
    const days: ForecastDay[] = [
      { date: "2026-09-12", min: 14, max: 24 },
      { date: "2026-09-13", min: 15, max: 25 },
    ];
    printForecast(makeCity(), days, "c");
    const output = lines.join("\n");
    expect(output).toContain("Pronóstico de Ottawa, Ontario (Canadá)");
    expect(output).toContain("14 / 24 °C");
    expect(output).toContain("15 / 25 °C");
  });
});

describe("printCityList", () => {
  test("numera las ciudades desde 1", () => {
    const lines = captureLog();
    const cities: City[] = [makeCity({ name: "Lima" }), makeCity({ name: "Bogotá" })];
    printCityList(cities);
    const output = lines.join("\n");
    expect(output).toContain("1. Lima");
    expect(output).toContain("2. Bogotá");
  });
});
