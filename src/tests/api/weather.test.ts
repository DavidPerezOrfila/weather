import { afterEach, describe, expect, test } from "bun:test";
import { fetchDailyForecast, fetchTemperature } from "../../api/weather.ts";
import { makeCity, restoreFetch, stubFetch } from "../helpers/helpers.ts";

afterEach(restoreFetch);

describe("fetchTemperature", () => {
  test("devuelve la temperatura actual", async () => {
    stubFetch({ forecast: { current: { temperature_2m: 21.5 } } });
    expect(await fetchTemperature(makeCity(), "c")).toBe(21.5);
  });

  test("lanza error si no hay datos actuales", async () => {
    stubFetch({ forecast: {} });
    await expect(fetchTemperature(makeCity(), "c")).rejects.toThrow("Sin datos de clima para Ottawa");
  });

  test("pide fahrenheit cuando la unidad es f", async () => {
    let requested = "";
    globalThis.fetch = (async (input: URL | Request | string) => {
      requested = String(input);
      return new Response(JSON.stringify({ current: { temperature_2m: 70 } }));
    }) as typeof fetch;

    await fetchTemperature(makeCity(), "f");
    expect(requested).toContain("temperature_unit=fahrenheit");
  });
});

describe("fetchDailyForecast", () => {
  test("mapea las series diarias a ForecastDay", async () => {
    stubFetch({
      forecast: {
        daily: {
          time: ["2026-09-12", "2026-09-13"],
          temperature_2m_max: [24, 25],
          temperature_2m_min: [14, 15],
        },
      },
    });

    expect(await fetchDailyForecast(makeCity(), "c")).toEqual([
      { date: "2026-09-12", min: 14, max: 24 },
      { date: "2026-09-13", min: 15, max: 25 },
    ]);
  });

  test("lanza error si no hay datos diarios", async () => {
    stubFetch({ forecast: {} });
    await expect(fetchDailyForecast(makeCity(), "c")).rejects.toThrow("Sin pronóstico para Ottawa");
  });
});
