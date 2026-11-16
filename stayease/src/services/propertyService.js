import { apiRequest, getAllPages } from "./api";
import { normalizeProperty } from "./normalizers";

function toApiProperty(data) {
  const property = {
    name: data.name?.trim(),
    description: data.description?.trim(),
    city_id: Number(data.city?.id ?? data.city_id ?? data.cityId),
    area: data.area?.trim() || data.location?.trim() || "",
    address: data.address?.trim() || "",
    image_url: data.image?.trim() || data.image_url?.trim() || undefined
  };
  return Object.fromEntries(
    Object.entries(property).filter(([, value]) => value !== undefined)
  );
}

export const propertyService = {
  async getAll() {
    const properties = await getAllPages("/properties");
    return properties.map(normalizeProperty);
  },

  async getMine() {
    const properties = await getAllPages("/properties/mine");
    return properties.map(normalizeProperty);
  },

  async getById(propertyId) {
    return normalizeProperty(await apiRequest(`/properties/${propertyId}`));
  },

  async create(propertyData) {
    const property = await apiRequest("/properties", {
      method: "POST",
      body: JSON.stringify(toApiProperty(propertyData))
    });
    return normalizeProperty(property);
  },

  async update(propertyId, updates) {
    const property = await apiRequest(`/properties/${propertyId}`, {
      method: "PATCH",
      body: JSON.stringify(toApiProperty(updates))
    });
    return normalizeProperty(property);
  },

  async delete(propertyId) {
    return apiRequest(`/properties/${propertyId}`, { method: "DELETE" });
  }
};