import { Link } from "react-router-dom";

import { useAuth } from "../../context/useAuth";
import { useBookings } from "../../context/useBookings";

import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import PropertyList from "../../components/manager/PropertyList";

const ManagerDashboard = () => {
  const { currentUser } = useAuth();

  const {
    properties,
    bookings,
    loading,
    error,
  } = useBookings();

  if (loading) {
    return <Loading />;
  }
  if (error) return <ErrorMessage message={error} />;

  const myProperties = properties.filter(
    (property) => String(property.managerId) === String(currentUser.id)
  );

  const myPropertyIds = myProperties.map((property) => property.id);

  const myBookings = bookings.filter((booking) =>
    myPropertyIds.includes(booking.propertyId)
  );

  const pendingBookings = myBookings.filter(
    (booking) => booking.status === "pending"
  );

  const confirmedBookings = myBookings.filter(
    (booking) => booking.status === "confirmed"
  );

  return (
    <div className="manager-page">
      <div className="manager-page-header">
        <div>
          <p className="page-eyebrow">MANAGER WORKSPACE</p>
          <h1>Welcome, {currentUser.name}</h1>
          <p>Manage your accommodation properties and reservations.</p>
        </div>

        <Link to="/manager/properties/new" className="primary-link">
          + Register Property
        </Link>
      </div>

      <section className="manager-section">
        <h2>Property Overview</h2>

        <div className="manager-stats-grid">
          <div className="manager-stat-card">
            <span>Total Properties</span>
            <strong>{myProperties.length}</strong>
          </div>

          <div className="manager-stat-card">
            <span>Properties with units</span>
            <strong>
              {myProperties.filter((property) => property.units?.length > 0).length}
            </strong>
          </div>

          <div className="manager-stat-card">
            <span>Total Units</span>
            <strong>
              {myProperties.reduce(
                (total, property) =>
                  total + (property.units?.reduce((count, unit) => count + unit.totalUnits, 0) || 0),
                0
              )}
            </strong>
          </div>
        </div>
      </section>

      <section className="manager-section">
        <h2>Booking Overview</h2>

        <div className="manager-stats-grid">
          <div className="manager-stat-card">
            <span>Total Bookings</span>
            <strong>{myBookings.length}</strong>
          </div>

          <div className="manager-stat-card">
            <span>Pending Requests</span>
            <strong>{pendingBookings.length}</strong>
          </div>

          <div className="manager-stat-card">
            <span>Confirmed Bookings</span>
            <strong>{confirmedBookings.length}</strong>
          </div>
        </div>

        <Link to="/manager/bookings" className="text-link">
          View and manage bookings →
        </Link>
      </section>

      <section className="manager-section">
        <div className="manager-section-heading">
          <h2>My Properties</h2>

          <Link to="/manager/properties">View all</Link>
        </div>

        <PropertyList properties={myProperties.slice(0, 3)} />
      </section>

      <section className="manager-section">
        <h2>Recent Booking Requests</h2>

        {pendingBookings.length === 0 ? (
          <p className="manager-muted">
            You have no pending booking requests.
          </p>
        ) : (
          <div className="manager-booking-preview">
            {pendingBookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="manager-booking-preview-item">
                <div>
                  <strong>{booking.customerName}</strong>
                  <p>{booking.propertyName}</p>
                </div>

                <span className="booking-pending-label">Pending</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ManagerDashboard;