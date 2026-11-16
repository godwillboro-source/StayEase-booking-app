import React from "react";
import { calculateNights } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";

function PriceCalculator({ unit, checkIn, checkOut }) {
  const validDates = Boolean(checkIn && checkOut && checkOut > checkIn);
  const days = validDates ? calculateNights(checkIn, checkOut) : 0;
  const months = validDates ? Math.max(1, Math.ceil(days / 30)) : 0;
  const pricePerMonth = Number(unit?.pricePerMonth || 0);
  const total = months * pricePerMonth;

}