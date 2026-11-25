import { useMemo, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useBookings } from "../../context/useBookings";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";

const ITEMS_PER_PAGE = 8;
const ManagerBookings = () => {
  const { currentUser } = useAuth();
  const {
    properties,
    bookings,
    bookingsPagination,
    updateBookingStatus,
    loading,
    error,
  } = useBookings();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const [actionError, setActionError] = useState("");
  const myPropertyIds = properties
    .filter((property) => String(property.managerId) === String(currentUser.id))
    .map((property) => property.id);
  const myBookings = bookings.filter((booking) =>
    myPropertyIds.some(
      (propertyId) => String(propertyId) === String(booking.propertyId)
    )
  );

  const filteredBookings = useMemo(() => {
    return myBookings.filter((booking) => {
      const searchValue = search.toLowerCase();
      const matchesSearch =
        booking.customerName?.toLowerCase().includes(searchValue) ||
        booking.propertyName?.toLowerCase().includes(searchValue) ||
        booking.unitName?.toLowerCase().includes(searchValue) ||
        String(booking.id).includes(searchValue);
      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [myBookings, search, statusFilter]);

  const totalPages = Math.ceil(
    filteredBookings.length / ITEMS_PER_PAGE
  );
  const hasActiveFilters = search !== "" || statusFilter !== "all";
  const paginationTotalPages =
    !hasActiveFilters &&
    bookingsPagination?.total === filteredBookings.length &&
    bookingsPagination?.perPage === ITEMS_PER_PAGE
      ? bookingsPagination.pages
      : totalPages;

  const activePage = paginationTotalPages > 0
    ? Math.min(currentPage, paginationTotalPages)
    : 1;
  const paginatedBookings = filteredBookings.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  const handleStatusChange = async (bookingId, status) => {
    const action = status === "confirmed"
      ? "confirm"
      : status === "cancelled"
        ? "cancel"
        : "complete";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} this booking?`
    );

    if (!confirmed) {
      return;
    }
    setUpdatingId(bookingId);
    setActionError("");

    try {
      const result = await updateBookingStatus(
        bookingId,
        status,
        currentUser.id
      );
      if (result?.success === false) {
        setActionError(result.error || "Unable to update booking.");
      }
    } catch (error) {
      setActionError(error.message || "Unable to update booking.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="manager-page">
      <div className="manager-page-header">
        <div>
          <p className="page-eyebrow">BOOKING MANAGEMENT</p>
          <h1>Booking Requests</h1>
          <p>Review reservations made for your properties.</p>
        </div>
      </div>

      {(error || actionError) && (
        <ErrorMessage message={actionError || error} />
      )}

      <div className="manager-booking-stats">
        <div>
          <span>Total Bookings</span>
          <strong>{myBookings.length}</strong>
        </div>

        <div>
          <span>Pending</span>
          <strong>
            {myBookings.filter((b) => b.status === "pending").length}
          </strong>
        </div>

        <div>
          <span>Confirmed</span>
          <strong>
            {myBookings.filter((b) => b.status === "confirmed").length}
          </strong>
        </div>

        <div>
          <span>Completed</span>
          <strong>
            {myBookings.filter((b) => b.status === "completed").length}
          </strong>
        </div>
      </div>

      <div className="manager-booking-toolbar">
        <input
          type="search"
          className="manager-booking-search"
          placeholder="Search customer, property or booking ID..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          className="manager-booking-filter"
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All bookings</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="manager-content-card">
        <div className="manager-section-heading">
          <h2>My Reservations</h2>
          <span>{filteredBookings.length} results</span>
        </div>
        {paginatedBookings.length === 0 ? (
          <p className="manager-muted">
            No bookings match your current search or filter.
          </p>
        ) : (
          <div className="manager-booking-table-container">
            <table className="manager-booking-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Property</th>
                  <th>Unit type</th>
                  <th>Start date</th>
                  <th>End date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.customerName || "Customer"}</td>
                    <td>{booking.propertyName || "Property"}</td>
                    <td>{booking.unitName || "Unit"}</td>
                    <td>{booking.checkIn}</td>
                    <td>{booking.checkOut}</td>
                    <td>
                      KES {Number(booking.total || 0).toLocaleString()}
                    </td>
                    <td>
                      <span className={`booking-status ${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      {booking.status === "pending" ? (
                        <div className="booking-actions">
                          <Button
                            size="small"
                            disabled={updatingId === booking.id}
                            onClick={() =>
                              handleStatusChange(booking.id, "confirmed")
                            }
                          >
                            Confirm
                          </Button>

                          <Button
                            variant="danger"
                            size="small"
                            disabled={updatingId === booking.id}
                            onClick={() =>
                              handleStatusChange(booking.id, "cancelled")
                            }
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : booking.status === "confirmed" ? (
                        <div className="booking-actions">
                          <Button
                            variant="secondary"
                            size="small"
                            disabled={updatingId === booking.id}
                            onClick={() =>
                              handleStatusChange(booking.id, "completed")
                            }
                          >
                            Complete
                          </Button>
                          <Button
                            variant="danger"
                            size="small"
                            disabled={updatingId === booking.id}
                            onClick={() =>
                              handleStatusChange(booking.id, "cancelled")
                            }
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <span className="booking-action-status">
                          No action required
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          currentPage={activePage}
          totalPages={paginationTotalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ManagerBookings;