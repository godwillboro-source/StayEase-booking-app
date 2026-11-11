import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBookings } from "../../context/BookingContext";
import BookingFormComponent from "../../components/booking/BookingForm";
import { formatCurrency } from "../../utils/formatCurrency";

function BookingFormPage() {
  const { propertyId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const {
    properties,
    loading,
    error,
    setError,
    getRoomAvailability,
    createBooking,
  } = useBookings();

 const [selectedRoom, setSelectedRoom] = useState(null);
 const [submitting, setSubmitting] = useState(false);
 const [pageError, setPageError] = useState("");

 const property = useMemo(
    () =>
      properties.find(
        (item) =>
          String(item.id) === String(propertyId) && item.status === "approved",
      ),
    [properties, propertyId],
  );