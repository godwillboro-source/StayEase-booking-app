import { apiRequest } from "./api";
import { normalizeUnit } from "./normalizers";

function toApiUnit(data) {
  const unit = {
    unit_type: data.unitType || data.unit_type,
    price_per_month: Number(data.pricePerMonth ?? data.price_per_month),
    bathrooms: Number(data.bathrooms ?? 1),
    amenities: data.amenities ?? data.description ?? "",
    total_units: Number(data.totalUnits ?? 1),
    available_units: Number(data.availableUnits ?? data.totalUnits ?? 1),
    image_url: data.image_url || undefined
  };
  return Object.fromEntries(
    Object.entries(unit).filter(([, value]) => value !== undefined)
  );
}

export const unitService = {
  async create(propertyId, unitData) {
    const unit = await apiRequest(`/properties/${propertyId}/units`, {
      method: "POST",
      body: JSON.stringify(toApiUnit(unitData))
    });
    return normalizeUnit(unit);
  },

  async update(unitId, updates) {
    const unit = await apiRequest(`/units/${unitId}`, {
      method: "PUT",
      body: JSON.stringify(toApiUnit(updates))
    });
    return normalizeUnit(unit);
  },

  async delete(unitId) {
    return apiRequest(`/units/${unitId}`, { method: "DELETE" });
  }
};