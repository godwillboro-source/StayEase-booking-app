import {
  apiRequest,
  getAllPages,
  getAllPagesWithMetadata
} from "./api";
import { normalizeBooking } from "./normalizers";

export const bookingService = {
  async getAll() {
    return (await getAllPages("/bookings")).map(normalizeBooking);
  },
  async getAllWithMetadata(perPage) {
    const result = await getAllPagesWithMetadata("/bookings", {}, perPage);
    return { ...result, items: result.items.map(normalizeBooking) };
  },
  async getMine() {
    return (await getAllPages("/bookings/mine")).map(normalizeBooking);
  },
  async getMineWithMetadata(perPage) {
    const result = await getAllPagesWithMetadata(
      "/bookings/mine",
      {},
      perPage
    );
    return { ...result, items: result.items.map(normalizeBooking) };
  },

  async create(bookingData) {
    const booking = await apiRequest("/bookings", {
      method: "POST",
      body: JSON.stringify({
        unit_id: Number(bookingData.unitId),
        start_date: bookingData.checkIn,
        end_date: bookingData.checkOut
      })
    });
    return normalizeBooking(booking);
  },

  async updateStatus(bookingId, status) {
    const booking = await apiRequest(`/bookings/${bookingId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    return normalizeBooking(booking);
  }
};
