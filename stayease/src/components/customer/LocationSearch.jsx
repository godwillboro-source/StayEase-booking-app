
import CitySearch from "../common/CitySearch";

const LocationSearch = ({
  value,
  onChange,
  selectedCity,
  onCitySelect,
  onSubmit
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <form className="location-search" onSubmit={handleSubmit}>
      <div className="location-search-controls">
        <CitySearch
          id="location-search"
          label="Where do you want to stay?"
          placeholder="Search for a city"
          value={value}
          onChange={onChange}
          selectedCity={selectedCity}
          onSelect={onCitySelect}
        />

        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </div>
    </form>
  );
};

export default LocationSearch;