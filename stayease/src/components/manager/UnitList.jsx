import { Link } from "react-router-dom";

import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import { formatCurrency } from "../../utils/formatCurrency";

const UnitList = ({ units, propertyId }) => {
  if (!units || units.length === 0) {
    return (
      <EmptyState
        title="No units added"
        message="Add unit types to make this property ready for booking."
      />
    );
  }

  return (
    <div className="unit-list">
      {units.map((unit) => (
        <div className="manager-unit-card" key={unit.id}>
          <div>
            <h3>{unit.name}</h3>

            <p>
              {formatCurrency(unit.pricePerMonth)} / month
            </p>

            <p>Available units: {unit.availableUnits} / {unit.totalUnits}</p>
            <p>Bathrooms: {unit.bathrooms}</p>
          </div>

          <Link to={`/manager/properties/${propertyId}/units/${unit.id}/edit`}>
            <Button variant="secondary" size="small">
              Edit Unit
            </Button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default UnitList;