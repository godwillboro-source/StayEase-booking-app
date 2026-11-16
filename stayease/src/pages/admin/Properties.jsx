import { useEffect, useMemo, useState } from "react";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loading from "../../components/common/Loading";
import Button from "../../components/common/Button";
import { adminService } from "../../services/adminService";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const loadProperties = () => adminService.getProperties()
    .then(setProperties)
    .catch((requestError) => setError(requestError.message))
    .finally(() => setLoading(false));

  useEffect(() => {
    loadProperties();
  }, []);

  const filteredProperties = useMemo(() => properties.filter((property) => {
    const matchesText = `${property.name} ${property.location}`
      .toLowerCase().includes(search.toLowerCase());
    return matchesText && (filter === "all" || property.status === filter);
  }), [properties, search, filter]);

  async function setStatus(propertyId, status) {
    setUpdatingId(propertyId);
    setError("");
    try {
      const updated = await adminService.updatePropertyStatus(propertyId, status);
      setProperties((previous) => previous.map((property) =>
        property.id === propertyId ? updated : property
      ));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="manager-page">
      <div className="manager-page-header">
        <div>
          <p className="page-eyebrow">ADMINISTRATION</p>
          <h1>Property approvals</h1>
          <p>Review listings submitted by property managers.</p>
        </div>
      </div>
      {error && <ErrorMessage message={error} />}
      <div className="manager-booking-toolbar">
        <input
          type="search"
          className="manager-booking-search"
          placeholder="Search properties or locations"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          className="manager-booking-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="manager-content-card manager-booking-table-container">
        <table className="manager-booking-table">
          <thead>
            <tr><th>Property</th><th>Location</th><th>Manager</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filteredProperties.map((property) => (
              <tr key={property.id}>
                <td>{property.name}</td>
                <td>{property.location || property.address}</td>
                <td>{property.manager?.name || "Manager"}</td>
                <td>{property.status}</td>
                <td>
                  {property.status === "pending" ? (
                    <div className="booking-actions">
                      <Button
                        size="small"
                        disabled={updatingId === property.id}
                        onClick={() => setStatus(property.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        disabled={updatingId === property.id}
                        onClick={() => setStatus(property.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="small"
                      disabled={updatingId === property.id}
                      onClick={() => setStatus(property.id, "pending")}
                    >
                      Return to pending
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProperties.length === 0 && <p>No properties match this filter.</p>}
      </div>
    </div>
  );
}

export default Properties;