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