import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useBookings } from "../../context/useBookings";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

function EditUnit() {
  const { propertyId, unitId } = useParams();
  const { currentUser } = useAuth();
  const { properties, updateUnit, loading, error } = useBookings();
  const navigate = useNavigate();

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const property = properties.find(
    (item) => String(item.id) === String(propertyId)
  );
  const unit = property?.units?.find(
    (item) => String(item.id) === String(unitId)
  );

  if (!property || !unit) {
    return (
      <div className="dashboard-page">
        <h1>Unit type not found</h1>
        <Link to="/manager/properties">Back to Properties</Link>
      </div>
    );
  }

  if (String(property.managerId) !== String(currentUser?.id)) {
    return (
      <div className="dashboard-page">
        <h1>Access denied</h1>
        <p>You cannot edit units belonging to another manager.</p>
      </div>
    );
  }

  return (
    <EditUnitForm
      key={unit.id}
      property={property}
      unit={unit}
      managerId={currentUser.id}
      updateUnit={updateUnit}
      navigate={navigate}
    />
  );
}

function EditUnitForm({ property, unit, managerId, updateUnit, navigate }) {
  const [formData, setFormData] = useState({
    unitType: unit.unitType || "studio",
    pricePerMonth: unit.pricePerMonth ?? "",
    bathrooms: unit.bathrooms ?? 1,
    amenities: unit.description || "",
    totalUnits: unit.totalUnits ?? 1,
    availableUnits: unit.availableUnits ?? 1
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (
      !Number.isFinite(Number(formData.pricePerMonth)) ||
      Number(formData.pricePerMonth) < 0 ||
      !Number.isInteger(Number(formData.bathrooms)) ||
      Number(formData.bathrooms) < 0 ||
      !Number.isInteger(Number(formData.totalUnits)) ||
      Number(formData.totalUnits) < 1 ||
      !Number.isInteger(Number(formData.availableUnits)) ||
      Number(formData.availableUnits) < 0 ||
      Number(formData.availableUnits) > Number(formData.totalUnits)
    ) {
      setError("Enter a valid monthly price, bathroom count and unit availability.");
      return;
    }

    setLoading(true);
    try {
      await updateUnit(property.id, unit.id, {
        ...formData,
        pricePerMonth: Number(formData.pricePerMonth),
        bathrooms: Number(formData.bathrooms),
        totalUnits: Number(formData.totalUnits),
        availableUnits: Number(formData.availableUnits)
      }, managerId);
      navigate(`/manager/properties/${property.id}/units`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Edit Unit Type</h1>
          <p>Update unit details for {property.name}.</p>
        </div>
        <Link
          to={`/manager/properties/${property.id}/units`}
          className="btn btn-secondary"
        >
          Back to Units
        </Link>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <label htmlFor="unitType">Unit type</label>
        <select id="unitType" name="unitType" value={formData.unitType} onChange={handleChange}>
          <option value="bedsitter">Bedsitter</option>
          <option value="studio">Studio</option>
          <option value="1_bedroom">1 bedroom</option>
          <option value="2_bedroom">2 bedroom</option>
          <option value="3_bedroom">3 bedroom</option>
          <option value="4_bedroom">4 bedroom</option>
        </select>

        <label htmlFor="amenities">Amenities (comma separated)</label>
        <textarea id="amenities" name="amenities" value={formData.amenities} onChange={handleChange} rows="3" />

        <label htmlFor="pricePerMonth">Monthly rent (KES)</label>
        <input id="pricePerMonth" name="pricePerMonth" type="number" min="0" value={formData.pricePerMonth} onChange={handleChange} required />

        <label htmlFor="bathrooms">Bathrooms</label>
        <input id="bathrooms" name="bathrooms" type="number" min="0" value={formData.bathrooms} onChange={handleChange} required />

        <label htmlFor="totalUnits">Total units</label>
        <input id="totalUnits" name="totalUnits" type="number" min="1" value={formData.totalUnits} onChange={handleChange} required />

        <label htmlFor="availableUnits">Available units</label>
        <input id="availableUnits" name="availableUnits" type="number" min="0" max={formData.totalUnits} value={formData.availableUnits} onChange={handleChange} required />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Unit Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditUnit;
