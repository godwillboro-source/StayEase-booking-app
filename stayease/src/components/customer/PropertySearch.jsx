import Button from "../common/Button";
import CitySearch from "../common/CitySearch";

function PropertySearch({
  value,
  onChange,
  selectedCity,
  onCitySelect,
  onSearch
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch?.(value.trim(), selectedCity);
  }

  return (
    <form className="property-search" onSubmit={handleSubmit}>
      <CitySearch
        id="property-location-search"
        label="Where would you like to stay?"
        placeholder="Search by city or location"
        value={value}
        onChange={onChange}
        selectedCity={selectedCity}
        onSelect={onCitySelect}
      />

      <Button type="submit">
        Search stays
      </Button>
    </form>
  );
}

export default PropertySearch;