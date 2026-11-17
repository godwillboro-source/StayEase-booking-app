import { apiRequest, getAllPages } from "./api";
import { normalizeBooking } from "./normalizers";

export const bookingService = {
  async getAll() {
    return (await getAllPages("/bookings")).map(normalizeBooking);
  },

  async getMine() {
    return (await getAllPages("/bookings/mine")).map(normalizeBooking);
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
