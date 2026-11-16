import { useEffect, useMemo, useState } from "react";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loading from "../../components/common/Loading";
import { adminService } from "../../services/adminService";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminService.getBookings()
      .then(setBookings)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredBookings = useMemo(() => bookings.filter((booking) => {
    const haystack = [
      booking.customerName,
      booking.propertyName,
      booking.unitName,
      booking.id
    ].join(" ").toLowerCase();
    return haystack.includes(search.toLowerCase()) &&
      (filter === "all" || booking.status === filter);
  }), [bookings, filter, search]);

  if (loading) return <Loading />;

  return (
    <div className="manager-page">
      <div className="manager-page-header">
        <div>
          <p className="page-eyebrow">ADMINISTRATION</p>
          <h1>Booking management</h1>
          <p>View reservations across StayEase.</p>
        </div>
      </div>
      {error && <ErrorMessage message={error} />}
      <div className="manager-booking-toolbar">
        <input
          type="search"
          className="manager-booking-search"
          placeholder="Search customer, property, unit or booking ID"
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
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="manager-content-card manager-booking-table-container">
        <table className="manager-booking-table">
          <thead>
            <tr><th>Booking</th><th>Customer</th><th>Property / unit</th><th>Dates</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td>#{booking.id}</td>
                <td>{booking.customerName}</td>
                <td>{booking.propertyName}<br />{booking.unitName}</td>
                <td>{formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}</td>
                <td>{formatCurrency(booking.total)}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredBookings.length === 0 && <p>No bookings match this filter.</p>}
      </div>
    </div>
  );
}

export default Bookings;