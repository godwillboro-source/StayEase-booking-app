
import React from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

function UnitCard({
  unit,
  propertyId
}) {
  return (
    <article className="unit-card">
      <div className="unit-card-content">
        <div>
          <h3>{unit.name}</h3>
          <p>{unit.description || "Comfortable accommodation."}</p>
        </div>

        <div className="unit-information">
          <span>Bathrooms: {unit.bathrooms}</span>
          <span>{unit.availableUnits} currently available / {unit.totalUnits} total</span>
        </div>

        <div className="unit-card-footer">
          <strong>
            {formatCurrency(unit.pricePerMonth)}
            <small> / month</small>
          </strong>

          {unit.available ? (
            <Link to={`/properties/${propertyId}/book?unitId=${unit.id}`}>
              <span className="btn btn-primary btn-small">Request unit</span>
            </Link>
          ) : (
            <span className="btn btn-secondary btn-small" aria-disabled="true">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default UnitCard;
