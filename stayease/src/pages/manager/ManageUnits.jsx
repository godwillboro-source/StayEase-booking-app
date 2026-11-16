import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../../context/useAuth";
import { useBookings } from "../../context/useBookings";

import UnitForm from "../../components/manager/UnitForm";
import UnitList from "../../components/manager/UnitList";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

const ManageUnits = () => {
  const { propertyId } = useParams();

  const { currentUser } = useAuth();

  const {
    properties,
    addUnit,
    loading,
    error: dataError,
  } = useBookings();

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (loading) {
    return <Loading />;
  }
  if (dataError) return <ErrorMessage message={dataError} />;

  const property = properties.find(
    (item) =>
      String(item.id) === String(propertyId) &&
      String(item.managerId) === String(currentUser.id)
  );

  if (!property) {
    return (
      <div className="manager-page">
        <ErrorMessage message="Property not found or you do not have permission to manage it." />
      </div>
    );
  }

  const handleAddUnit = async (formData) => {
    setSaving(true);
    setError("");

    try {
      const result = await addUnit(
        property.id,
        formData,
        currentUser.id
      );

      if (result?.success === false) {
        setError(result.error || "Unable to add unit.");
        return;
      }

      setShowForm(false);
    } catch (error) {
      setError(error.message || "Unable to add unit.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="manager-page">
      <div className="manager-page-header">
        <div>
          <p className="page-eyebrow">UNIT MANAGEMENT</p>
          <h1>{property.name}</h1>
          <p>Manage the rental unit types available at this property.</p>
        </div>

        <Link
          to={`/manager/properties/${property.id}/edit`}
          className="secondary-link"
        >
          Edit Property
        </Link>
      </div>

      <div className="manager-property-summary">
        <p>
          <strong>Location:</strong> {property.location}
        </p>

        <p>
          <strong>Unit types:</strong> {property.units?.length || 0}
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="manager-section-heading">
        <h2>Unit types</h2>

        <button
          type="button"
          className="primary-link"
          onClick={() => setShowForm((previous) => !previous)}
        >
          {showForm ? "Close Form" : "+ Add Unit Type"}
        </button>
      </div>

      {showForm && (
        <div className="manager-content-card">
          <h2>Add a Unit Type</h2>

          <UnitForm
            onSubmit={handleAddUnit}
            submitLabel="Save Unit"
            loading={saving}
          />
        </div>
      )}

      <UnitList
        units={property.units || []}
        propertyId={property.id}
      />
    </div>
  );
};

export default ManageUnits;