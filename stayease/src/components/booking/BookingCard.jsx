import React from "react";
import { Link } from "react-router-dom";
import BookingStatus from "./BookingStatus";
import Button from "../common/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

function BookingCard({ booking, onCancel, showCustomer = false, detailsPath }) {
  const bookingDetailsPath = detailsPath || `/customer/bookings/${booking.id}`;
  return (
    <article className="booking-card">
      <div className="booking-card-header">
        <div>
          <span className="booking-reference">Booking #{booking.id}</span>
          <h3>{booking.propertyName}</h3>
        </div>
        <BookingStatus status={booking.status} />
      </div>

      <div className="booking-card-details">
        <div>
          <span>Unit type</span>
          <strong>{booking.unitName}</strong>
        </div>

        {showCustomer && (
          <div>
            <span>Customer</span>
            <strong>{booking.customerName}</strong>
          </div>
        )}

        <div>
          <span>Start date</span>
          <strong>{formatDate(booking.checkIn)}</strong>
        </div>

        <div>
          <span>End date</span>
          <strong>{formatDate(booking.checkOut)}</strong>
        </div>

        <div>
          <span>Booking period</span>
          <strong>{booking.durationDays} days</strong>
        </div>

        <div>
          <span>Total</span>
          <strong>{formatCurrency(booking.total)}</strong>
        </div>
      </div>

      <div className="booking-card-actions">
        <Link to={bookingDetailsPath} className="text-link">
          View details
        </Link>
        {onCancel && ["pending", "confirmed"].includes(booking.status) && (
          <Button
            variant="danger"
            size="small"
            onClick={() => onCancel(booking.id)}
          >
            Cancel booking
          </Button>
        )}
      </div>
    </article>
  );
}
