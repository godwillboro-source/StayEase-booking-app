import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loading from "../../components/common/Loading";
import { adminService } from "../../services/adminService";
import { formatCurrency } from "../../utils/formatCurrency";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([adminService.getStats(), adminService.getBookings()])
      .then(([overview, recentBookings]) => {
        setStats(overview);
        setBookings(recentBookings.slice(0, 5));
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="manager-page">
      <div className="manager-page-header">
        <div>
          <p className="page-eyebrow">STAYEASE ADMINISTRATION</p>
          <h1>Admin Dashboard</h1>
          <p>Monitor managers, properties and reservations.</p>
        </div>
      </div>
      {error && <ErrorMessage message={error} />}

      {stats && (
        <>
          <section className="manager-section">
            <h2>Platform overview</h2>
            <div className="manager-stats-grid">
              <Stat label="Managers" value={stats.users.managers} />
              <Stat label="Pending managers" value={stats.users.pending_managers} />
              <Stat label="Customers" value={stats.users.customers} />
              <Stat label="Properties" value={stats.properties.total} />
              <Stat label="Awaiting review" value={stats.properties.pending} />
              <Stat label="Bookings" value={stats.bookings.total} />
              <Stat label="Units" value={stats.units} />
              <Stat label="Cities" value={stats.cities} />
              <Stat label="Confirmed revenue" value={formatCurrency(stats.revenue)} />
            </div>
          </section>

          <section className="manager-section">
            <div className="manager-section-heading">
              <h2>Administration</h2>
            </div>
            <div className="admin-quick-links">
              <Link to="/admin/managers">Review manager accounts →</Link>
              <Link to="/admin/properties">Review property listings →</Link>
              <Link to="/admin/bookings">View all bookings →</Link>
              <Link to="/admin/cities">Manage cities →</Link>
            </div>
          </section>

          <section className="manager-section">
            <div className="manager-section-heading">
              <h2>Recent bookings</h2>
              <Link to="/admin/bookings">View all</Link>
            </div>
            <div className="manager-content-card">
              {bookings.length === 0 ? (
                <p>No bookings yet.</p>
              ) : bookings.map((booking) => (
                <div className="recent-booking-item" key={booking.id}>
                  <div>
                    <strong>{booking.customerName}</strong>
                    <p>{booking.propertyName}</p>
                  </div>
                  <span className="recent-booking-status">{booking.status}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="manager-stat-card">
      <span>{label}</span>
      <strong>{value ?? 0}</strong>
    </div>
  );
}

export default AdminDashboard;