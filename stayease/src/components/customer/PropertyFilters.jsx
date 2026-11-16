
function PropertyFilters({
  unitTypes = [],
  unitType,
  onUnitTypeChange,
  maxPrice,
  onMaxPriceChange,
  onClear
}) {
  return (
    <div className="property-filters">
      <div className="filter-group">
        <label htmlFor="property-type-filter">
          Unit type
        </label>

        <select
          id="property-type-filter"
          value={unitType}
          onChange={(event) => onUnitTypeChange(event.target.value)}
        >
          <option value="all">All unit types</option>
          {unitTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="property-max-price">
          Maximum price per month
        </label>

        <input
          id="property-max-price"
          type="number"
          min="0"
          value={maxPrice}
          onChange={(event) => onMaxPriceChange(event.target.value)}
          placeholder="Any price"
        />
      </div>

      <button type="button" className="clear-filters" onClick={onClear}>
        Clear filters
      </button>
    </div>
  );
}

export default PropertyFilters;

