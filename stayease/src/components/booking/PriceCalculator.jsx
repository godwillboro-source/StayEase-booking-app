import React from "react";
import { calculateNights } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";

function PriceCalculator({ unit, checkIn, checkOut }) {
  const validDates = Boolean(checkIn && checkOut && checkOut > checkIn);
  const days = validDates ? calculateNights(checkIn, checkOut) : 0;
  const months = validDates ? Math.max(1, Math.ceil(days / 30)) : 0;
  const pricePerMonth = Number(unit?.pricePerMonth || 0);
  const total = months * pricePerMonth;

  return (
    <div className="price-calculator">
      <h3>Price breakdown</h3>

      <div className="price-calculator-row">
        <span>Monthly rent</span>
        <strong>{formatCurrency(pricePerMonth)}</strong>
      </div>

      <div className="price-calculator-row">
        <span>Rental period</span>
        <strong>
          {days} days / {months} month{months === 1 ? "" : "s"}
        </strong>
      </div>

      <div className="price-calculator-total">
        <span>Estimated total</span>
        <strong>{formatCurrency(total)}</strong>
      </div>
      {!validDates && (
        <p className="form-hint">
          Select start and end dates to estimate rent. Partial months are
          charged as full months.
        </p>
      )}
    </div>
  );
}

export default PriceCalculator;