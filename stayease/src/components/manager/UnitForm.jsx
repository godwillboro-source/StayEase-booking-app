import React, { useState } from "react";

import Input from "../common/Input";
import Button from "../common/Button";

function UnitForm({
  initialData = {},
  onSubmit,
  submitLabel = "Add Unit",
  loading = false
}) {
  const [formData, setFormData] = useState({
    unitType: "studio",
    pricePerMonth: "",
    bathrooms: "1",
    amenities: "",
    totalUnits: "1",
    availableUnits: "1",
    ...initialData
  });

  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => {
      if (name === "totalUnits" && Number(previous.availableUnits) === Number(previous.totalUnits)) {
        return { ...previous, totalUnits: value, availableUnits: value };
      }
      return { ...previous, [name]: value };
    });
  }

  function validate() {
    const newErrors = {};

    if (
      !Number.isFinite(Number(formData.pricePerMonth)) ||
      Number(formData.pricePerMonth) <= 0
    ) {
      newErrors.pricePerMonth = "Enter a valid monthly price.";
    }

    if (
      !Number.isInteger(Number(formData.bathrooms)) ||
      Number(formData.bathrooms) < 0
    ) {
      newErrors.bathrooms = "Enter a valid number of bathrooms.";
    }

    if (
      !Number.isInteger(Number(formData.totalUnits)) ||
      Number(formData.totalUnits) < 1
    ) {
      newErrors.totalUnits = "Enter at least 1 unit.";
    }

    if (
      !Number.isInteger(Number(formData.availableUnits)) ||
      Number(formData.availableUnits) < 0 ||
      Number(formData.availableUnits) > Number(formData.totalUnits)
    ) {
      newErrors.availableUnits = "Available units must be between 0 and total units.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) return;

    onSubmit({
      unitType: formData.unitType,
      pricePerMonth: Number(formData.pricePerMonth),
      bathrooms: Number(formData.bathrooms),
      amenities: formData.amenities.trim(),
      totalUnits: Number(formData.totalUnits),
      availableUnits: Number(formData.availableUnits)
    });
  }

  return (
    <form className="manager-form" onSubmit={handleSubmit}>
      <label htmlFor="unitType">Unit type</label>
      <select
        id="unitType"
        name="unitType"
        value={formData.unitType}
        onChange={handleChange}
        required
      >
        <option value="bedsitter">Bedsitter</option>
        <option value="studio">Studio</option>
        <option value="1_bedroom">1 bedroom</option>
        <option value="2_bedroom">2 bedroom</option>
        <option value="3_bedroom">3 bedroom</option>
        <option value="4_bedroom">4 bedroom</option>
      </select>

      <Input
        label="Amenities (comma separated)"
        name="amenities"
        value={formData.amenities}
        onChange={handleChange}
      />

      <Input
        label="Monthly rent (KES)"
        name="pricePerMonth"
        type="number"
        min="0"
        value={formData.pricePerMonth}
        onChange={handleChange}
        required
        error={errors.pricePerMonth}
      />

      <Input
        label="Bathrooms"
        name="bathrooms"
        type="number"
        min="0"
        value={formData.bathrooms}
        onChange={handleChange}
        required
        error={errors.bathrooms}
      />

      <Input
        label="Total units"
        name="totalUnits"
        type="number"
        min="1"
        value={formData.totalUnits}
        onChange={handleChange}
        required
        error={errors.totalUnits}
      />

      <Input
        label="Available units"
        name="availableUnits"
        type="number"
        min="0"
        value={formData.availableUnits}
        onChange={handleChange}
        required
        error={errors.availableUnits}
      />

      <Button type="submit" loading={loading} fullWidth>
        {submitLabel}
      </Button>
    </form>
  );
}

export default UnitForm;