import {
  useCallback,
  useEffect,
  useState
} from "react";
import { BookingContext } from "./bookingContext";
import { useAuth } from "./useAuth";
import { apiRequest, getAllPages } from "../services/api";
import { bookingService } from "../services/bookingService";
import { propertyService } from "../services/propertyService";
import { unitService } from "../services/unitService";
import { normalizeBooking, normalizeProperty } from "../services/normalizers";

function mergeProperties(...collections) {
  return [...new Map(collections.flat().map((item) => [item.id, item])).values()];
}

export function BookingProvider({ children }) {
  const { currentUser } = useAuth();
  const currentUserId = currentUser?.id;
  const currentUserRole = currentUser?.role;
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingsPagination, setBookingsPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const propertyRequest = currentUserRole === "admin"
        ? getAllPages("/admin/properties")
        : propertyService.getAll();
      const bookingRequest = !currentUserRole
        ? Promise.resolve([])
        : currentUserRole === "customer"
          ? bookingService.getMineWithMetadata(8)
          : bookingService.getAllWithMetadata(8);

      const [listedProperties, userBookings] = await Promise.all([
        propertyRequest,
        bookingRequest
      ]);

      let allProperties = listedProperties.map(normalizeProperty);
      if (currentUserRole === "manager" && currentUserId) {
        const ownedProperties = await propertyService.getMine();
        allProperties = mergeProperties(allProperties, ownedProperties);
      }

      setProperties(allProperties);
      setBookings(
        Array.isArray(userBookings)
          ? userBookings.map(normalizeBooking)
          : userBookings.items.map(normalizeBooking)
      );
      setBookingsPagination(
        Array.isArray(userBookings)
          ? null
          : {
              page: userBookings.page,
              pages: userBookings.pages,
              perPage: userBookings.per_page,
              total: userBookings.total
            }
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, currentUserRole]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) loadData();
    });
    return () => {
      active = false;
    };
  }, [loadData]);

  async function addProperty(formData) {
    const property = await propertyService.create(formData);
    setProperties((previous) => mergeProperties(previous, [property]));
    return { success: true, property };
  }

  async function updateProperty(propertyId, updates) {
    const property = await propertyService.update(propertyId, updates);
    setProperties((previous) => mergeProperties(previous, [property]));
    return { success: true, property };
  }

  async function addUnit(propertyId, formData) {
    const unit = await unitService.create(propertyId, formData);
    setProperties((previous) => previous.map((property) =>
      property.id === Number(propertyId)
        ? { ...property, units: [...(property.units || []), unit] }
        : property
    ));
    return { success: true, unit };
  }

  async function updateUnit(propertyId, unitId, formData) {
    const unit = await unitService.update(unitId, formData);
    setProperties((previous) => previous.map((property) =>
      property.id === Number(propertyId)
        ? {
            ...property,
            units: property.units.map((item) =>
              item.id === Number(unitId) ? unit : item
            )
          }
        : property
    ));
    return { success: true, unit };
  }

  async function deleteUnit(unitId) {
    await unitService.delete(unitId);
    setProperties((previous) => previous.map((property) => ({
      ...property,
      units: property.units.filter((unit) => unit.id !== Number(unitId))
    })));
  }

  async function createBooking(formData) {
    const booking = await bookingService.create(formData);
    setBookings((previous) => [booking, ...previous]);
    return { success: true, booking };
  }

  async function updateBookingStatus(bookingId, status) {
    const booking = await bookingService.updateStatus(bookingId, status);
    setBookings((previous) => previous.map((item) =>
      item.id === Number(bookingId) ? booking : item
    ));
    return { success: true, booking };
  }

  async function cancelBooking(bookingId) {
    return updateBookingStatus(bookingId, "cancelled");
  }

  const getPropertyById = useCallback(async (propertyId) => {
    const property = await apiRequest(`/properties/${propertyId}`);
    const normalized = normalizeProperty(property);
    setProperties((previous) => mergeProperties(previous, [normalized]));
    return normalized;
  }, []);

  const value = {
    properties,
    bookings,
    bookingsPagination,
    loading,
    error,
    setError,
    refresh: loadData,
    getPropertyById,
    addProperty,
    updateProperty,
    addUnit,
    updateUnit,
    deleteUnit,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    setProperties,
    setBookings
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}
