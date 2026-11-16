import { Link, useParams } from "react-router-dom";
import { useBookings } from "../../context/useBookings";

import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

import PropertyGallery from "../../components/customer/PropertyGallery";
import UnitCard from "../../components/customer/UnitCard";

const PropertyDetails = () => {
  const { propertyId } = useParams();
  const { properties = [], loading, error } = useBookings();

  if (loading) {
    return <Loading message="Loading property details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const property = properties.find(
    (item) => String(item.id) === String(propertyId)
  );

  if (!property) {
    return (
      <main className="customer-page">
        <EmptyState
          title="Property not found"
          message="This property does not exist."
        />

        <Link to="/properties" className="btn btn-primary">
          Browse properties
        </Link>
      </main>
    );
  }

  const units = property.units || [];

  return (
    <main className="customer-page">
      <Link to="/properties" className="back-link">
        ← Back to properties
      </Link>

      <section className="property-details">
        <PropertyGallery
          images={[property.image]}
          propertyName={property.name}
        />

        <div className="property-details-content">
          <h1>{property.name}</h1>

          <p className="property-location">
            {property.location}
          </p>

          <p>{property.description}</p>
        </div>
      </section>

      <section className="customer-unit-section">
        <div className="section-heading">
          <h2>Available unit types</h2>
          <span>{units.length} unit types</span>
        </div>

        {units.length === 0 ? (
          <EmptyState
            title="No units listed"
            message="The property manager has not added any units yet."
          />
        ) : (
          <div className="customer-unit-grid">
            {units.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                propertyId={property.id}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default PropertyDetails;