import { beforeEach, describe, expect, it, vi } from "vitest";
import { bookingService } from "../../src/services/bookingService";
import { apiRequest, getAllPages } from "../../src/services/api";

vi.mock("../../src/services/api", () => ({
  apiRequest: vi.fn(),
  getAllPages: vi.fn()
}));

describe("bookingService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads the current customer's bookings from all pages", async () => {
    vi.mocked(getAllPages).mockResolvedValue([]);

    await bookingService.getMine();

    expect(getAllPages).toHaveBeenCalledWith("/bookings/mine");
  });

  it("creates a booking with API field names", async () => {
    vi.mocked(apiRequest).mockResolvedValue({
      unit_id: 8,
      start_date: "2026-03-01",
      end_date: "2026-03-03",
      total_price: 100
    });

    await expect(bookingService.create({
      unitId: "8",
      checkIn: "2026-03-01",
      checkOut: "2026-03-03"
    })).resolves.toMatchObject({
      unitId: 8,
      durationDays: 2,
      total: 100
    });
    expect(apiRequest).toHaveBeenCalledWith("/bookings", {
      method: "POST",
      body: JSON.stringify({
        unit_id: 8,
        start_date: "2026-03-01",
        end_date: "2026-03-03"
      })
    });
  });

  it("updates booking status with PATCH", async () => {
    vi.mocked(apiRequest).mockResolvedValue({ id: 4, status: "confirmed" });

    await bookingService.updateStatus(4, "confirmed");

    expect(apiRequest).toHaveBeenCalledWith("/bookings/4/status", {
      method: "PATCH",
      body: JSON.stringify({ status: "confirmed" })
    });
  });
});
