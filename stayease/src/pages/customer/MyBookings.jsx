import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBookings } from "../../context/BookingContext";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import BookingCard from "../../components/booking/BookingCard";

const MyBookings = () => {
  const { currentUser } = useAuth();
  const { bookings = [], loading, error, cancelBooking } = useBookings();
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionError, setActionError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const myBookings = useMemo(() => {
    return bookings.filter(
      (booking) => String(booking.customerId) === String(currentUser?.id),
    );
  }, [bookings, currentUser?.id]);

  const filteredBookings = myBookings.filter(
    (booking) => statusFilter === "all" || booking.status === statusFilter,
  );

  const handleCancel = async (booking) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) return;

    setActionError("");
    setCancellingId(booking.id);

}