import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useBookings } from "../../context/useBookings";
import CitySearch from "../../components/common/CitySearch";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

function EditProperty() {
  const { propertyId } = useParams();
  const { currentUser } = useAuth();
  const { properties, updateProperty, loading, error } = useBookings();
  const navigate = useNavigate();

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const property = properties.find(
    (item) => String(item.id) === String(propertyId)
  );
  if (!property) {
    return (
      <div className="dashboard-page">
        <h1>Property not found</h1>
        <Link to="/manager/properties">Back to Properties</Link>
      </div>
    );
  }
  if (String(property.managerId) !== String(currentUser?.id)) {
    return (
      <div className="dashboard-page">
        <h1>Access denied</h1>
        <p>You cannot edit another manager&apos;s property.</p>
      </div>
    );
  }

  return (
    <PropertyEditForm
      key={property.id}
      property={property}
      updateProperty={updateProperty}
      navigate={navigate}
    />
  );
}

function PropertyEditForm({ property, updateProperty, navigate }) {
  const [formData, setFormData] = useState({
    name: property.name || "",
    location: property.area || "",
    address: property.address || property.area || "",
    city: property.city || null,
    cityQuery: property.city?.name || "",
    description: property.description || "",
    image: property.image || ""
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
      !formData.name.trim() ||
      !formData.location.trim() ||
      !formData.description.trim() ||
      !formData.city
    ) {
      setError("Complete the required fields and choose a city.");
      return;
    }

    setLoading(true);
    try {
      await updateProperty(property.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        area: formData.location.trim(),
        address: formData.address.trim(),
        city: formData.city,
        image: formData.image.trim()
      });
      navigate("/manager/properties");
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
          <h1>Edit Property</h1>
          <p>Update your property information.</p>
        </div>
        <Link to="/manager/properties" className="btn btn-secondary">Back</Link>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <label htmlFor="name">Property Name</label>
        <input id="name" name="name" value={formData.name} onChange={handleChange} required />

        <CitySearch
          id="property-city"
          label="City"
          value={formData.cityQuery}
          selectedCity={formData.city}
          onChange={(cityQuery) => setFormData((previous) => ({
            ...previous,
            cityQuery,
            city: null
          }))}
          onSelect={(city) => setFormData((previous) => ({ ...previous, city }))}
          required
        />

        <label htmlFor="location">Neighborhood</label>
        <input id="location" name="location" value={formData.location} onChange={handleChange} required />

        <label htmlFor="address">Street address (optional)</label>
        <input id="address" name="address" value={formData.address} onChange={handleChange} />

        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="5" required />

        <label htmlFor="image">Image URL</label>
        <input id="image" name="image" type="url" value={formData.image} onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditProperty;