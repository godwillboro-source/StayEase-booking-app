import { beforeEach, describe, expect, it, vi } from "vitest";
import { adminService } from "../../src/services/adminService";
import { apiRequest, getAllPages } from "../../src/services/api";

vi.mock("../../src/services/api", () => ({
  apiRequest: vi.fn(),
  getAllPages: vi.fn()
}));

describe("adminService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("gets managers with role and optional approval filter", async () => {
    vi.mocked(getAllPages).mockResolvedValue([]);

    await adminService.getManagers(false);
    await adminService.getManagers();

    expect(getAllPages).toHaveBeenNthCalledWith(1, "/admin/users", {
      role: "manager",
      is_approved: "false"
    });
    expect(getAllPages).toHaveBeenNthCalledWith(2, "/admin/users", { role: "manager" });
  });

  it("updates a manager and deletes a user with the expected methods", async () => {
    vi.mocked(apiRequest).mockResolvedValue({});

    await adminService.updateManager(2, { is_approved: true });
    await adminService.deleteUser(2);

    expect(apiRequest).toHaveBeenNthCalledWith(1, "/admin/users/2", {
      method: "PATCH",
      body: JSON.stringify({ is_approved: true })
    });
    expect(apiRequest).toHaveBeenNthCalledWith(2, "/admin/users/2", { method: "DELETE" });
  });

  it("normalizes admin properties and bookings", async () => {
    vi.mocked(getAllPages)
      .mockResolvedValueOnce([{ id: 5, area: "CBD" }])
      .mockResolvedValueOnce([{ id: 8, total_price: 450 }]);

    await expect(adminService.getProperties("pending")).resolves.toMatchObject([
      { id: 5, location: "CBD" }
    ]);
    await expect(adminService.getBookings()).resolves.toMatchObject([
      { id: 8, total: 450 }
    ]);
    expect(getAllPages).toHaveBeenNthCalledWith(1, "/admin/properties", { status: "pending" });
    expect(getAllPages).toHaveBeenNthCalledWith(2, "/bookings");
  });

  it("sends city updates and deletes to the city endpoints", async () => {
    vi.mocked(apiRequest).mockResolvedValue({});

    await adminService.createCity("Nairobi");
    await adminService.updateCity(3, "Mombasa");
    await adminService.deleteCity(3);

    expect(apiRequest).toHaveBeenNthCalledWith(1, "/cities", {
      method: "POST",
      body: JSON.stringify({ name: "Nairobi" })
    });
    expect(apiRequest).toHaveBeenNthCalledWith(2, "/cities/3", {
      method: "PUT",
      body: JSON.stringify({ name: "Mombasa" })
    });
    expect(apiRequest).toHaveBeenNthCalledWith(3, "/cities/3", { method: "DELETE" });
  });
});
