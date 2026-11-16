import { useEffect, useState } from "react";
import Button from "../../components/common/Button";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loading from "../../components/common/Loading";
import { adminService } from "../../services/adminService";

function Cities() {
  const [cities, setCities] = useState([]);
  const [name, setName] = useState("");
  const [editingCityId, setEditingCityId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    adminService.getCities()
      .then(setCities)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  function resetForm() {
    setName("");
    setEditingCityId(null);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const cityName = name.trim();
    if (cityName.length < 2) {
      setError("City names must contain at least 2 characters.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (editingCityId === null) {
        const city = await adminService.createCity(cityName);
        setCities((previous) =>
          [...previous, city].sort((a, b) => a.name.localeCompare(b.name))
        );
      } else {
        const city = await adminService.updateCity(editingCityId, cityName);
        setCities((previous) => previous
          .map((item) => item.id === city.id ? city : item)
          .sort((a, b) => a.name.localeCompare(b.name)));
      }
      resetForm();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(city) {
    if (!window.confirm(`Delete ${city.name}?`)) return;
    setError("");
    try {
      await adminService.deleteCity(city.id);
      setCities((previous) => previous.filter((item) => item.id !== city.id));
      if (editingCityId === city.id) resetForm();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="manager-page">
      <div className="manager-page-header">
        <div>
          <p className="page-eyebrow">ADMINISTRATION</p>
          <h1>City management</h1>
          <p>Add the cities managers can use when registering properties.</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <form className="form-card" onSubmit={handleSubmit}>
        <h2>{editingCityId === null ? "Add a city" : "Edit city"}</h2>
        <label htmlFor="city-name">City name</label>
        <input
          id="city-name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Nairobi"
          maxLength={100}
          required
        />
        <div className="booking-actions">
          <Button type="submit" loading={saving}>
            {editingCityId === null ? "Add city" : "Save changes"}
          </Button>
          {editingCityId !== null && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <section className="manager-section">
        <div className="manager-section-heading">
          <h2>Cities</h2>
          <span>{cities.length} total</span>
        </div>
        {cities.length === 0 ? (
          <div className="manager-content-card">
            <p>No cities yet. Add one above to enable property registration.</p>
          </div>
        ) : (
          <div className="manager-content-card manager-booking-table-container">
            <table className="manager-booking-table">
              <thead>
                <tr><th>City</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {cities.map((city) => (
                  <tr key={city.id}>
                    <td>{city.name}</td>
                    <td>
                      <div className="booking-actions">
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() => {
                            setName(city.name);
                            setEditingCityId(city.id);
                            setError("");
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="danger"
                          onClick={() => handleDelete(city)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Cities;