import { afterEach, describe, expect, test } from "bun:test";
import { searchCity } from "../../api/geocoding.ts";
import { restoreFetch, stubFetch } from "../helpers/helpers.ts";

afterEach(restoreFetch);

describe("searchCity", () => {
  test("mapea el primer resultado a una City sin campos extra", async () => {
    stubFetch({
      "geocoding-api": {
        results: [
          {
            name: "Ottawa",
            country: "Canadá",
            admin1: "Ontario",
            latitude: 45.4,
            longitude: -75.7,
            timezone: "America/Toronto",
          },
        ],
      },
    });

    expect(await searchCity("ottawa")).toEqual({
      name: "Ottawa",
      country: "Canadá",
      admin1: "Ontario",
      latitude: 45.4,
      longitude: -75.7,
    });
  });

  test("devuelve null si no hay resultados", async () => {
    stubFetch({ "geocoding-api": { results: [] } });
    expect(await searchCity("xyz")).toBeNull();
  });

  test("devuelve null si falta la clave results", async () => {
    stubFetch({ "geocoding-api": {} });
    expect(await searchCity("xyz")).toBeNull();
  });
});
