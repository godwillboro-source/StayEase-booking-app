import { describe, expect, it, vi } from "vitest";
import { formatCityLabel, formatPropertyLocation, getCities } from "../../src/services/cityService";
import { apiRequest } from "../../src/services/api";

vi.mock("../../src/services/api", () => ({ apiRequest: vi.fn() }));

describe("cityService helpers", () => {
  it("gets cities from the API", async () => {
    vi.mocked(apiRequest).mockResolvedValue([{ id: 1, name: "Nairobi" }]);

    await expect(getCities()).resolves.toEqual([{ id: 1, name: "Nairobi" }]);
    expect(apiRequest).toHaveBeenCalledWith("/cities");
  });

  it("formats city and property location labels", () => {
    expect(formatCityLabel({ name: "Nairobi" })).toBe("Nairobi");
    expect(formatCityLabel(null)).toBe("");
    expect(formatPropertyLocation(" CBD ", { name: "Nairobi" })).toBe("CBD, Nairobi");
    expect(formatPropertyLocation("Nairobi", { name: "Nairobi" })).toBe("Nairobi");
  });
});
