import { afterEach, describe, expect, mock, test } from "bun:test";
import { addCity } from "../../actions/addCity.ts";
import { getForecast } from "../../actions/getForecast.ts";
import { getDefaultWeather } from "../../actions/getWeather.ts";
import { listCitiesWeather } from "../../actions/listCities.ts";
import { removeCity } from "../../actions/removeCity.ts";
import { setDefaultCity } from "../../actions/setDefaultCity.ts";
import { captureLog, makeCity, makeConfig, restoreFetch, stubFetch } from "../helpers/helpers.ts";

afterEach(() => {
  mock.restore();
  restoreFetch();
});

describe("getDefaultWeather", () => {
  test("avisa cuando no hay ciudad default", async () => {
    const lines = captureLog();
    await getDefaultWeather(makeConfig());
    expect(lines.join("\n")).toContain("No hay ciudad default");
  });

  test("avisa cuando la default no está en la lista", async () => {
    const lines = captureLog();
    await getDefaultWeather(makeConfig({ defaultCity: "Lima" }));
    expect(lines.join("\n")).toContain("No hay ciudad default");
  });

  test("imprime el clima de la ciudad default", async () => {
    stubFetch({ forecast: { current: { temperature_2m: 20 } } });
    const lines = captureLog();
    await getDefaultWeather(makeConfig({ cities: [makeCity()], defaultCity: "Ottawa" }));
    expect(lines.join("\n")).toContain("Ottawa");
    expect(lines.join("\n")).toContain("20 °C");
  });
});

describe("listCitiesWeather", () => {
  test("avisa cuando no hay ciudades", async () => {
    const lines = captureLog();
    await listCitiesWeather(makeConfig());
    expect(lines.join("\n")).toContain("No hay ciudades guardadas");
  });

  test("imprime el clima de cada ciudad", async () => {
    stubFetch({ forecast: { current: { temperature_2m: 18 } } });
    const lines = captureLog();
    const config = makeConfig({ cities: [makeCity({ name: "Lima" }), makeCity({ name: "Bogotá" })] });
    await listCitiesWeather(config);
    expect(lines.join("\n")).toContain("Lima");
    expect(lines.join("\n")).toContain("Bogotá");
  });
});

describe("addCity", () => {
  test("no hace nada con búsqueda vacía", async () => {
    stubFetch({});
    const config = makeConfig();
    await addCity(async () => "", config);
    expect(config.cities).toEqual([]);
  });

  test("avisa cuando la ciudad no se encuentra", async () => {
    stubFetch({ "geocoding-api": { results: [] } });
    const lines = captureLog();
    const config = makeConfig();
    await addCity(async () => "xyz", config);
    expect(config.cities).toEqual([]);
    expect(lines.join("\n")).toContain('No se encontró "xyz"');
  });

  test("avisa cuando la ciudad ya está guardada", async () => {
    stubFetch({ "geocoding-api": { results: [{ name: "Ottawa", country: "Canadá", latitude: 45.4, longitude: -75.7 }] } });
    const lines = captureLog();
    const config = makeConfig({ cities: [makeCity()] });
    await addCity(async () => "ottawa", config);
    expect(config.cities).toHaveLength(1);
    expect(lines.join("\n")).toContain("ya está guardada");
  });

  test("agrega la ciudad y muestra su clima", async () => {
    stubFetch({
      "geocoding-api": { results: [{ name: "Lima", country: "Perú", latitude: -12, longitude: -77 }] },
      forecast: { current: { temperature_2m: 22 } },
    });
    const lines = captureLog();
    const config = makeConfig();
    await addCity(async () => "lima", config);
    expect(config.cities.map((city) => city.name)).toEqual(["Lima"]);
    expect(lines.join("\n")).toContain("22 °C");
  });
});

describe("removeCity", () => {
  test("elimina la ciudad elegida", async () => {
    captureLog();
    const config = makeConfig({ cities: [makeCity({ name: "Lima" }), makeCity({ name: "Bogotá" })] });
    await removeCity(async () => "1", config);
    expect(config.cities.map((city) => city.name)).toEqual(["Bogotá"]);
  });
});

describe("setDefaultCity", () => {
  test("establece la ciudad elegida como default", async () => {
    captureLog();
    const config = makeConfig({ cities: [makeCity({ name: "Lima" })] });
    await setDefaultCity(async () => "1", config);
    expect(config.defaultCity).toBe("Lima");
  });
});

describe("getForecast", () => {
  test("imprime el pronóstico de la ciudad elegida", async () => {
    stubFetch({
      forecast: {
        daily: {
          time: ["2026-09-12"],
          temperature_2m_max: [24],
          temperature_2m_min: [14],
        },
      },
    });
    const lines = captureLog();
    const config = makeConfig({ cities: [makeCity({ name: "Lima" })] });
    await getForecast(async () => "1", config);
    expect(lines.join("\n")).toContain("Pronóstico de Lima");
    expect(lines.join("\n")).toContain("14 / 24 °C");
  });
});
