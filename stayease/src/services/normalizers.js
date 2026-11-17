const UNIT_TYPE_LABELS = {
  bedsitter: "Bedsitter",
  studio: "Studio",
  "1_bedroom": "1 bedroom",
  "2_bedroom": "2 bedroom",
  "3_bedroom": "3 bedroom",
  "4_bedroom": "4 bedroom"
};

export function normalizeUnit(unit) {
  if (!unit) return null;

  const pricePerMonth = Number(unit.price_per_month ?? unit.pricePerMonth ?? 0);
  const totalUnits = Number(unit.total_units ?? unit.totalUnits ?? 1);
  const availableUnits = Number(unit.available_units ?? unit.availableUnits ?? totalUnits);

  return {
    ...unit,
    propertyId: unit.property_id ?? unit.propertyId,
    unitType: unit.unit_type ?? unit.unitType,
    name: UNIT_TYPE_LABELS[unit.unit_type ?? unit.unitType] || unit.name || "Unit",
    description: unit.amenities || unit.description || "",
    pricePerMonth,
    bathrooms: unit.bathrooms ?? 1,
    totalUnits,
    availableUnits,
    available: availableUnits > 0,
    image: unit.image_url || unit.image || ""
  };
}

export function normalizeProperty(property) {
  if (!property) return null;

  const city = property.city || null;
  const area = property.area || "";
  const location = [area, city?.name].filter(Boolean).join(", ");

  return {
    ...property,
    managerId: property.manager_id ?? property.managerId ?? property.manager?.id,
    cityId: property.city_id ?? property.cityId ?? city?.id,
    location: location || property.address || "",
    image: property.image_url || property.image || "",
    units: (property.units || []).map(normalizeUnit)
  };
}

export function normalizeBooking(booking) {
  if (!booking) return null;

  const unit = normalizeUnit(booking.unit);
  const property = normalizeProperty(booking.unit?.property);
  const startDate = booking.start_date ?? booking.checkIn;
  const endDate = booking.end_date ?? booking.checkOut;
  const durationDays = startDate && endDate
    ? Math.max(1, Math.ceil(
        (new Date(`${endDate}T00:00:00`) - new Date(`${startDate}T00:00:00`)) /
          (1000 * 60 * 60 * 24)
      ))
    : 0;

  return {
    ...booking,
    customerId: booking.customer_id ?? booking.customerId,
    customerName: booking.customer?.name || booking.customerName || "Customer",
    customerPhone: booking.customer?.phone || "",
    propertyId: property?.id ?? booking.propertyId,
    propertyName: property?.name || booking.propertyName || "Property",
    managerId: property?.managerId ?? booking.managerId,
    unitId: booking.unit_id ?? booking.unitId,
    unitName: unit?.name || booking.unitName || "Unit",
    unit,
    checkIn: startDate,
    checkOut: endDate,
    durationDays,
    pricePerMonth: unit?.pricePerMonth ?? booking.pricePerMonth ?? 0,
    total: Number(booking.total_price ?? booking.total ?? 0)
  };
}