import { beforeEach, describe, expect, it, vi } from "vitest";
import { unitService } from "../../src/services/unitService";
import { apiRequest } from "../../src/services/api";

vi.mock("../../src/services/api", () => ({ apiRequest: vi.fn() }));

describe("unitService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates a unit using API field names and normalizes the response", async () => {
    vi.mocked(apiRequest).mockResolvedValue({
      unit_type: "studio",
      price_per_month: 850,
      total_units: 2,
      available_units: 1
    });

    await expect(unitService.create(12, {
      unitType: "studio",
      pricePerMonth: "850",
      bathrooms: "1",
      amenities: "Wi-Fi",
      totalUnits: "2",
      availableUnits: "1"
    })).resolves.toMatchObject({
      name: "Studio",
      pricePerMonth: 850,
      available: true
    });
    expect(apiRequest).toHaveBeenCalledWith("/properties/12/units", {
      method: "POST",
      body: JSON.stringify({
        unit_type: "studio",
        price_per_month: 850,
        bathrooms: 1,
        amenities: "Wi-Fi",
        total_units: 2,
        available_units: 1
      })
    });
  });

  it("updates and deletes a unit by its ID", async () => {
    vi.mocked(apiRequest).mockResolvedValue({});

    await unitService.update(6, { pricePerMonth: 1200 });
    await unitService.delete(6);

    expect(apiRequest).toHaveBeenNthCalledWith(1, "/units/6", {
      method: "PUT",
      body: JSON.stringify({
        price_per_month: 1200,
        bathrooms: 1,
        amenities: "",
        total_units: 1,
        available_units: 1
      })
    });
    expect(apiRequest).toHaveBeenNthCalledWith(2, "/units/6", { method: "DELETE" });
  });
});
