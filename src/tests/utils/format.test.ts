import { describe, expect, test } from "bun:test";
import { formatLocation, unitSymbol } from "../../utils/format.ts";
import { makeCity } from "../helpers/helpers.ts";

describe("unitSymbol", () => {
  test("devuelve °C para celsius", () => {
    expect(unitSymbol("c")).toBe("°C");
  });

  test("devuelve °F para fahrenheit", () => {
    expect(unitSymbol("f")).toBe("°F");
  });
});

describe("formatLocation", () => {
  test("incluye la región cuando admin1 existe", () => {
    expect(formatLocation(makeCity())).toBe("Ottawa, Ontario (Canadá)");
  });

  test("omite la región cuando admin1 no existe", () => {
    expect(formatLocation(makeCity({ admin1: undefined }))).toBe("Ottawa (Canadá)");
  });
});
