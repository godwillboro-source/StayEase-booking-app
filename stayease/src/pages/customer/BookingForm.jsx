import React, { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useBookings } from "../../context/useBookings";
import BookingFormComponent from "../../components/booking/BookingForm";
import { formatCurrency } from "../../utils/formatCurrency";

function BookingFormPage() {
  const { propertyId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { properties, loading, error, createBooking } = useBookings();
  const [selectedUnitId, setSelectedUnitId] = useState(
    () => searchParams.get("unitId") || ""
  );
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");

  const property = useMemo(
    () => properties.find((item) => String(item.id) === String(propertyId)),
    [properties, propertyId]
  );
  const selectedUnit = property?.units?.find(
    (unit) => String(unit.id) === String(selectedUnitId) && unit.available
  ) || null;

  async function handleBookingSubmit(formData) {
    setPageError("");
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (!property || !selectedUnit?.available) {
      setPageError("Please select an available unit type.");
      return;
    }

    setSubmitting(true);
    try {
      await createBooking({
        ...formData,
        propertyId: property.id,
        unitId: selectedUnit.id
      });
      navigate("/customer/bookings");
    } catch (requestError) {
      setPageError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="loading-message">Loading property...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!property) {
    return (
      <main className="customer-page">
        <h2>Property unavailable</h2>
        <p>This property does not exist.</p>
        <button onClick={() => navigate("/properties")}>Browse properties</button>
      </main>
    );
  }

  const availableUnits = property.units?.filter((unit) => unit.available) || [];
  if (availableUnits.length === 0) {
    return (
      <main className="customer-page">
        <h2>No units available</h2>
        <p>This property currently has no available units.</p>
        <button onClick={() => navigate(`/properties/${property.id}`)}>
          Back to property
        </button>
      </main>
    );
  }

  return (
    <main className="customer-page booking-page">
      <div className="customer-page-header">
        <button
          type="button"
          onClick={() => navigate(`/properties/${property.id}`)}
          className="btn btn-secondary"
        >
          Back to property
        </button>
        <h1>Request a rental</h1>
        <p>{property.name}</p>
        <p>{property.location}</p>
      </div>

      {pageError && <div className="error-message">{pageError}</div>}

      <div className="booking-page-content">
        <section className="booking-form-section">
          <BookingFormComponent
            property={property}
            selectedUnit={selectedUnit}
            onUnitChange={(unit) => setSelectedUnitId(unit?.id ?? "")}
            onSubmit={handleBookingSubmit}
            loading={submitting}
          />
        </section>

        <aside className="booking-property-summary">
          <h3>Property information</h3>
          <img
            src={property.image || "/images/default-property.jpg"}
            alt={property.name}
            className="booking-property-image"
          />
          <h3>{property.name}</h3>
          <p>{property.location}</p>
          {selectedUnit && (
            <div className="selected-unit-summary">
              <p>Selected unit: {selectedUnit.name}</p>
              <p>Monthly rent: {formatCurrency(selectedUnit.pricePerMonth)}</p>
              <p>{selectedUnit.availableUnits} units currently available</p>
            </div>
          )}
          <p className="booking-form-note">
            Rent is calculated in 30-day months; a partial month counts as a full month.
          </p>
        </aside>
      </div>
    </main>
  );
}

export default BookingFormPage;
