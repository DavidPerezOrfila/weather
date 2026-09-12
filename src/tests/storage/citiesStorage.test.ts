import { describe, expect, test } from "bun:test";
import { appendCity, deleteCity, findCity, hasCity } from "../../storage/citiesStorage.ts";
import { makeCity, makeConfig } from "../helpers/helpers.ts";

describe("findCity", () => {
  test("devuelve la ciudad que coincide por nombre", () => {
    const config = makeConfig({ cities: [makeCity({ name: "Lima" })] });
    expect(findCity(config, "Lima")?.name).toBe("Lima");
  });

  test("devuelve undefined si no existe", () => {
    expect(findCity(makeConfig(), "Lima")).toBeUndefined();
  });
});

describe("hasCity", () => {
  test("true cuando la ciudad está guardada", () => {
    const config = makeConfig({ cities: [makeCity({ name: "Lima" })] });
    expect(hasCity(config, "Lima")).toBe(true);
  });

  test("false cuando no está", () => {
    expect(hasCity(makeConfig(), "Lima")).toBe(false);
  });
});

describe("appendCity", () => {
  test("agrega la ciudad al final", () => {
    const config = makeConfig({ cities: [makeCity({ name: "Lima" })] });
    appendCity(config, makeCity({ name: "Bogotá" }));
    expect(config.cities.map((city) => city.name)).toEqual(["Lima", "Bogotá"]);
  });
});

describe("deleteCity", () => {
  test("elimina la ciudad indicada", () => {
    const config = makeConfig({
      cities: [makeCity({ name: "Lima" }), makeCity({ name: "Bogotá" })],
    });
    deleteCity(config, "Lima");
    expect(config.cities.map((city) => city.name)).toEqual(["Bogotá"]);
  });

  test("limpia defaultCity cuando la ciudad eliminada era la default", () => {
    const config = makeConfig({ cities: [makeCity({ name: "Lima" })], defaultCity: "Lima" });
    deleteCity(config, "Lima");
    expect(config.defaultCity).toBeNull();
  });

  test("conserva defaultCity si era otra ciudad", () => {
    const config = makeConfig({
      cities: [makeCity({ name: "Lima" }), makeCity({ name: "Bogotá" })],
      defaultCity: "Bogotá",
    });
    deleteCity(config, "Lima");
    expect(config.defaultCity).toBe("Bogotá");
  });
});
