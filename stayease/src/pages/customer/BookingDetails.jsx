import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useBookings } from "../../context/useBookings";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import BookingStatus from "../../components/booking/BookingStatus";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const BookingDetails = () => {
  const { bookingId } = useParams();
  const { currentUser } = useAuth();
  const { bookings = [], loading, error } = useBookings();

  if (loading) {
    return <Loading message="Loading booking details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const booking = bookings.find(
    (item) =>
      String(item.id) === String(bookingId) &&
      String(item.customerId) === String(currentUser?.id)
  );

  if (!booking) {
    return (
      <main className="customer-page">
        <EmptyState
          title="Booking not found"
          message="This booking does not exist or does not belong to your account."
        />

        <Link to="/customer/bookings" className="btn btn-primary">
          Back to my bookings
        </Link>
      </main>
    );
  }

  const statusMessages = {
    pending: "Your booking is waiting for the property manager's response.",
    confirmed: "Your booking has been confirmed by the property manager.",
    cancelled: "This booking has been cancelled.",
    completed: "This booking has been completed.",
  };

  return (
    <main className="customer-page">
      <Link to="/customer/bookings" className="back-link">
        ← Back to my bookings
      </Link>

      <section className="booking-details-card">
        <header className="booking-details-header">
          <div>
            <h1>Booking details</h1>
            <p>Booking reference: #{booking.id}</p>
          </div>

          <BookingStatus status={booking.status} />
        </header>

        <div className="booking-details-grid">
          <div>
            <span>Property</span>
            <strong>{booking.propertyName}</strong>
          </div>

          <div>
            <span>Unit type</span>
            <strong>{booking.unitName}</strong>
          </div>

          <div>
            <span>Customer</span>
            <strong>{booking.customerName}</strong>
          </div>

          <div>
            <span>Start date</span>
            <strong>{formatDate(booking.checkIn)}</strong>
          </div>

          <div>
            <span>End date</span>
            <strong>{formatDate(booking.checkOut)}</strong>
          </div>

          <div>
            <span>Rental period (days)</span>
            <strong>{booking.durationDays}</strong>
          </div>

          <div>
            <span>Monthly rent</span>
            <strong>{formatCurrency(booking.pricePerMonth)}</strong>
          </div>

          <div>
            <span>Total price</span>
            <strong>{formatCurrency(booking.total)}</strong>
          </div>

          <div>
            <span>Booking status</span>
            <BookingStatus status={booking.status} />
          </div>
        </div>

        <div className="booking-status-message">
          <p>
            {statusMessages[booking.status] ||
              "Check your reservation status for updates."}
          </p>
        </div>
      </section>
    </main>
  );
};

export default BookingDetails;