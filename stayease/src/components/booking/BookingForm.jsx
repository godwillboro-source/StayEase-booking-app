import React, { useState } from "react";
import Select from "../common/Select";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import DateSelector from "./DateSelector";
import PriceCalculator from "./PriceCalculator";
import { validateStay } from "../../utils/validation";

function BookingForm({
  property,
  selectedUnit,
  onUnitChange,
  onSubmit,
  loading = false,
}) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [error, setError] = useState("");
  const availableUnits = property.units.filter((unit) => unit.available);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!selectedUnit) {
      setError("Please select a unit type.");
      return;
    }

    const dateError = validateStay(checkIn, checkOut);
    if (dateError) {
      setError(dateError);
      return;
    }
    onSubmit({
      propertyId: property.id,
      unitId: selectedUnit.id,
      checkIn,
      checkOut,
    });
  }
  const unitOptions = availableUnits.map((unit) => ({
    value: String(unit.id),
    label: `${unit.name} — KES ${unit.pricePerMonth.toLocaleString()} per month`,
  }));

  function handleUnitChange(event) {
    const unitId = Number(event.target.value);
    const unit = availableUnits.find((item) => item.id === unitId);
    onUnitChange(unit || null);
    setError("");
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h2>Request a rental</h2>
      <ErrorMessage message={error} />
      <Select
        label="Choose a unit type"
        name="unitId"
        value={selectedUnit ? String(selectedUnit.id) : ""}
        onChange={handleUnitChange}
        options={unitOptions}
        placeholder="Select a unit type"
        required
      />

      {selectedUnit && (
        <>
          <DateSelector
            checkIn={checkIn}
            checkOut={checkOut}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
          />
          <PriceCalculator
            unit={selectedUnit}
            checkIn={checkIn}
            checkOut={checkOut}
          />
        </>
      )}

      <Button
        type="submit"
        fullWidth
        loading={loading}
        disabled={!selectedUnit}
      >
        Submit rental request
      </Button>
      <p className="booking-form-note">
        Your request will be sent to the property manager for confirmation.
      </p>
    </form>
  );
}