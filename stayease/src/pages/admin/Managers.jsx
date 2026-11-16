import { useEffect, useMemo, useState } from "react";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loading from "../../components/common/Loading";
import Button from "../../components/common/Button";
import { adminService } from "../../services/adminService";

function Managers() {
  const [managers, setManagers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const loadManagers = () => adminService.getManagers()
    .then(setManagers)
    .catch((requestError) => setError(requestError.message))
    .finally(() => setLoading(false));

  useEffect(() => {
    loadManagers();
  }, []);

  const filteredManagers = useMemo(() => managers.filter((manager) => {
    const matchesText = `${manager.name} ${manager.email}`
      .toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filter === "all" ||
      (filter === "pending" && !manager.is_approved) ||
      (filter === "approved" && manager.is_approved) ||
      (filter === "blocked" && !manager.is_active);
    return matchesText && matchesStatus;
  }), [managers, search, filter]);

  async function updateManager(manager, changes) {
    setUpdatingId(manager.id);
    setError("");
    try {
      await adminService.updateManager(manager.id, changes);
      await loadManagers();
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
          <h1>Manager accounts</h1>
          <p>Approve managers before they can list properties.</p>
        </div>
      </div>
      {error && <ErrorMessage message={error} />}
      <div className="manager-booking-toolbar">
        <input
          type="search"
          className="manager-booking-search"
          placeholder="Search name or email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          className="manager-booking-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">All managers</option>
          <option value="pending">Awaiting approval</option>
          <option value="approved">Approved</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>
      <div className="manager-content-card manager-booking-table-container">
        <table className="manager-booking-table">
          <thead>
            <tr><th>Manager</th><th>Email</th><th>Approval</th><th>Account</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filteredManagers.map((manager) => (
              <tr key={manager.id}>
                <td>{manager.name}</td>
                <td>{manager.email}</td>
                <td>{manager.is_approved ? "Approved" : "Pending"}</td>
                <td>{manager.is_active ? "Active" : "Blocked"}</td>
                <td>
                  <div className="booking-actions">
                    {!manager.is_approved && (
                      <Button
                        size="small"
                        disabled={updatingId === manager.id}
                        onClick={() => updateManager(manager, { is_approved: true })}
                      >
                        Approve
                      </Button>
                    )}
                    <Button
                      variant={manager.is_active ? "danger" : "secondary"}
                      size="small"
                      disabled={updatingId === manager.id}
                      onClick={() => updateManager(manager, { is_active: !manager.is_active })}
                    >
                      {manager.is_active ? "Block" : "Unblock"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredManagers.length === 0 && <p>No managers match this filter.</p>}
      </div>
    </div>
  );
}

export default Managers;