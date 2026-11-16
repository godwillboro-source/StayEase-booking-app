import React from "react";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

function BookingSummary({ booking }) {
  return (
    <div className="booking-summary">
      <div className="booking-summary-header">
        <h3>Booking summary</h3>
        <strong>#{booking.id}</strong>
      </div>

      <div className="booking-summary-details">
        <div>
          <span>Property</span>
          <strong>{booking.propertyName}</strong>
        </div>

        <div>
          <span>Unit type</span>
          <strong>{booking.unitName}</strong>
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
          <span>Duration</span>
          <strong>{booking.durationDays} days</strong>
        </div>

        <div className="booking-summary-total">
          <span>Total price</span>
          <strong>{formatCurrency(booking.total)}</strong>
        </div>
      </div>
    </div>
  );
}