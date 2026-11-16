import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useBookings } from "../../context/useBookings";
import CitySearch from "../../components/common/CitySearch";
import { formatPropertyLocation } from "../../services/cityService";

function AddProperty() {
  const { currentUser } = useAuth();
  const { addProperty } = useBookings();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    city: null,
    description: "",
    image: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!currentUser) {
      setError("You must be logged in to register a property.");
      return;
    }

    if (!formData.name.trim() || !formData.description.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    if (!formData.city) {
      setError("Choose a city from the search results.");
      return;
    }

    setLoading(true);

    try {
      const result = await addProperty({
        ...formData,
        area: formData.location.trim(),
        address: formData.location.trim(),
        location: formatPropertyLocation(formData.location, formData.city)
      }, currentUser.id);

      if (!result.success) {
        setError(result.error);
        return;
      }

      navigate("/manager/properties");
    } catch (err) {
      setError(err.message || "Unable to register property.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Register Property</h1>
          <p>Register your property for monthly rental bookings.</p>
        </div>

        <Link to="/manager/properties" className="btn btn-secondary">
          Back to Properties
        </Link>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}

        <label htmlFor="name">Property Name</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Sunrise Apartments"
          required
        />

        <CitySearch
          id="property-city"
          label="City"
          value={formData.cityQuery || ""}
          selectedCity={formData.city}
          onChange={(cityQuery) => {
            setFormData((previous) => ({
              ...previous,
              cityQuery,
              city: null
            }));
          }}
          onSelect={(city) => {
            setFormData((previous) => ({
              ...previous,
              city
            }));
          }}
          required
        />

        <label htmlFor="location">Neighborhood or street address</label>
        <input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. Kilimani"
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          placeholder="Describe your property..."
          required
        />

        <label htmlFor="image">Image URL (optional)</label>
        <input
          id="image"
          name="image"
          type="url"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/property.jpg"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register Property"}
        </button>
      </form>
    </div>
  );
}

export default AddProperty;