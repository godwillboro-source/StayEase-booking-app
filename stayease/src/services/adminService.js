import { apiRequest, getAllPages } from "./api";
import { normalizeBooking, normalizeProperty } from "./normalizers";

export const adminService = {
  async getStats() {
    return apiRequest("/admin/stats");
  },

  async getManagers(isApproved) {
    const params = { role: "manager" };
    if (typeof isApproved === "boolean") {
      params.is_approved = String(isApproved);
    }
    return getAllPages("/admin/users", params);
  },

  async updateManager(managerId, updates) {
    return apiRequest(`/admin/users/${managerId}`, {
      method: "PATCH",
      body: JSON.stringify(updates)
    });
  },

  async getProperties(status) {
    const params = status ? { status } : {};
    return (await getAllPages("/admin/properties", params)).map(normalizeProperty);
  },

  async updatePropertyStatus(propertyId, status) {
    const property = await apiRequest(`/admin/properties/${propertyId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    return normalizeProperty(property);
  },

  async getBookings() {
    return (await getAllPages("/bookings")).map(normalizeBooking);
  },

  async getCities() {
    return apiRequest("/cities");
  },

  async createCity(name) {
    return apiRequest("/cities", {
      method: "POST",
      body: JSON.stringify({ name })
    });
  },

  async updateCity(cityId, name) {
    return apiRequest(`/cities/${cityId}`, {
      method: "PUT",
      body: JSON.stringify({ name })
    });
  },

  async deleteCity(cityId) {
    return apiRequest(`/cities/${cityId}`, { method: "DELETE" });
  }
};