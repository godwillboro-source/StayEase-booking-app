import { describe, expect, it } from "vitest";
import {
  normalizeBooking,
  normalizeProperty,
  normalizeUnit
} from "../../src/services/normalizers";

describe("normalizeUnit", () => {
  it("maps API fields to the UI shape and calculates availability", () => {
    expect(normalizeUnit({
      unit_type: "2_bedroom",
      property_id: 7,
      price_per_month: "1200",
      total_units: 3,
      available_units: 0,
      image_url: "/unit.jpg"
    })).toMatchObject({
      propertyId: 7,
      unitType: "2_bedroom",
      name: "2 bedroom",
      pricePerMonth: 1200,
      totalUnits: 3,
      availableUnits: 0,
      available: false,
      image: "/unit.jpg"
    });
  });

  it("returns null for a missing unit", () => {
    expect(normalizeUnit(null)).toBeNull();
  });
});

describe("normalizeProperty", () => {
  it("maps its city, location, image, manager, and units", () => {
    expect(normalizeProperty({
      id: 4,
      name: "Green Homes",
      manager_id: 9,
      area: "Westlands",
      city: { id: 2, name: "Nairobi" },
      image_url: "/property.jpg",
      units: [{ unit_type: "studio", available_units: 1 }]
    })).toMatchObject({
      managerId: 9,
      cityId: 2,
      location: "Westlands, Nairobi",
      image: "/property.jpg",
      units: [{ name: "Studio", available: true }]
    });
  });
});

describe("normalizeBooking", () => {
  it("normalizes booking details and computes duration", () => {
    expect(normalizeBooking({
      customer_id: 3,
      customer: { name: "Ari", phone: "555-0100" },
      unit_id: 8,
      unit: {
        unit_type: "studio",
        price_per_month: 900,
        property: { id: 4, name: "Green Homes", manager_id: 9 }
      },
      start_date: "2026-03-01",
      end_date: "2026-03-04",
      total_price: "2700"
    })).toMatchObject({
      customerId: 3,
      customerName: "Ari",
      customerPhone: "555-0100",
      propertyId: 4,
      propertyName: "Green Homes",
      managerId: 9,
      unitId: 8,
      unitName: "Studio",
      checkIn: "2026-03-01",
      checkOut: "2026-03-04",
      durationDays: 3,
      pricePerMonth: 900,
      total: 2700
    });
  });
});
