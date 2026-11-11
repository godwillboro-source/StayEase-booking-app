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

  // Select a room automatically when a roomId is provided in the URL.
  useEffect(() => {
    if (!property) return;
    const requestedRoomId = searchParams.get("roomId");
    if (!requestedRoomId) return;
    const room = property.rooms?.find(
      (item) => String(item.id) === requestedRoomId && item.available,
    );
    setSelectedRoom(room || null);
  }, [property, searchParams]);

  async function handleBookingSubmit(formData) {
    setPageError("");
    setError?.("");

    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (!property || property.status !== "approved") {
      setPageError("This property is not available for booking.");
      return;
    }
    if (!selectedRoom || !selectedRoom.available) {
      setPageError("Please select an available room.");
      return;
    }
    setSubmitting(true);

    try {
      // Check room availability for the selected dates.
      const isAvailable = await getRoomAvailability(
        property.id,
        selectedRoom.id,
        formData.checkIn,
        formData.checkOut,
      );
      if (!isAvailable) {
        setPageError(
          "This room is not available for the selected dates. Please choose different dates.",
        );
        return;
      }

      const checkInDate = new Date(`${formData.checkIn}T00:00:00`);
      const checkOutDate = new Date(`${formData.checkOut}T00:00:00`);
      const nights = Math.ceil(
        (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24),
      );
      if (nights < 1) {
        setPageError("Please select valid check-in and check-out dates.");
        return;
      }

      const pricePerNight = Number(selectedRoom.pricePerNight);
      const total = pricePerNight * nights;
      const bookingData = {
        ...formData,
        customerId: currentUser.id,
        customerName: currentUser.name,
        propertyId: property.id,
        propertyName: property.name,
        managerId: property.managerId,
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        nights,
        pricePerNight,
        total,
      };
      const result = await createBooking(bookingData, currentUser);

      if (result?.success === false) {
        setPageError(result.error || "Unable to create your booking.");
        return;
      }

      navigate("/customer/bookings");
    } catch (err) {
      setPageError(
        err.message || "Something went wrong while creating your booking.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="loading-message">Loading property...</p>;
  }
  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!property) {
    return (
      <main className="customer-page">
        <h2>Property unavailable</h2>
        <p>This property does not exist or has not been approved.</p>
        <button onClick={() => navigate("/properties")}>
          Browse properties
        </button>
      </main>
    );
  }
  
  const availableRooms = property.rooms?.filter((room) => room.available) || [];


}