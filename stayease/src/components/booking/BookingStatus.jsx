import React from "react";
import StatusBadge from "../common/StatusBadge";

function BookingStatus({ status }) {
  const messages = {
    pending: "Your booking is waiting for manager confirmation.",
    confirmed: "Your booking has been confirmed.",
    cancelled: "This booking has been cancelled.",
    completed: "This booking has been completed.",
  };

  return (
    <div className="booking-status">
      <StatusBadge status={status} />
      <p>{messages[status] || "Booking status unavailable."}</p>
    </div>
  );
}

export default BookingStatus;