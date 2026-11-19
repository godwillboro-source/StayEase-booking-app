import { beforeEach, describe, expect, it, vi } from "vitest";
import { propertyService } from "../../src/services/propertyService";
import { apiRequest, getAllPages } from "../../src/services/api";

vi.mock("../../src/services/api", () => ({
  apiRequest: vi.fn(),
  getAllPages: vi.fn()
}));

describe("propertyService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads and normalizes all properties", async () => {
    vi.mocked(getAllPages).mockResolvedValue([
      { id: 1, area: "CBD", city: { name: "Nairobi" } }
    ]);

    await expect(propertyService.getAll()).resolves.toMatchObject([
      { id: 1, location: "CBD, Nairobi" }
    ]);
    expect(getAllPages).toHaveBeenCalledWith("/properties");
  });

  it("sends normalized API fields when creating a property", async () => {
    vi.mocked(apiRequest).mockResolvedValue({ id: 3, name: "New place" });

    await propertyService.create({
      name: " New place ",
      description: " Nice stay ",
      city: { id: "2" },
      area: " Westlands ",
      address: " 1 Main St ",
      image: " /place.jpg "
    });

    expect(apiRequest).toHaveBeenCalledWith("/properties", {
      method: "POST",
      body: JSON.stringify({
        name: "New place",
        description: "Nice stay",
        city_id: 2,
        area: "Westlands",
        address: "1 Main St",
        image_url: "/place.jpg"
      })
    });
  });

  it("uses PATCH for updates and DELETE for removal", async () => {
    vi.mocked(apiRequest).mockResolvedValue({});

    await propertyService.update(3, { cityId: 4 });
    await propertyService.delete(3);

    expect(apiRequest).toHaveBeenNthCalledWith(1, "/properties/3", {
      method: "PATCH",
      body: JSON.stringify({
        city_id: 4,
        area: "",
        address: ""
      })
    });
    expect(apiRequest).toHaveBeenNthCalledWith(2, "/properties/3", { method: "DELETE" });
  });
});
