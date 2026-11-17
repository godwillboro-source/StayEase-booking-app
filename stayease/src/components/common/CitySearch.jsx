import { useEffect, useMemo, useState } from "react";
import {
  formatCityLabel,
  getCities
} from "../../services/cityService";

function CitySearch({
  id,
  label = "City",
  placeholder = "Choose a city",
  value = "",
  onChange,
  selectedCity,
  onSelect,
  required = false
}) {
  const [cities, setCities] = useState([]);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getCities()
      .then((results) => {
        if (active) setCities(results);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });
    return () => {
      active = false;
    };
  }, []);

  const results = useMemo(() => {
    const query = value.trim().toLowerCase();
    return cities
      .filter((city) => !query || city.name.toLowerCase().includes(query))
      .slice(0, 6);
  }, [cities, value]);

  function handleChange(event) {
    onChange(event.target.value);
    onSelect(null);
    setIsOpen(true);
  }

  function handleSelect(city) {
    onChange(city.name);
    onSelect(city);
    setIsOpen(false);
  }

  return (
    <div className="city-search">
      <label htmlFor={id}>
        {label}
        {required && <span className="required-mark"> *</span>}
      </label>

      <input
        id={id}
        type="search"
        value={value}
        onChange={handleChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
        placeholder={placeholder}
        autoComplete="off"
        required={required && !selectedCity}
        aria-autocomplete="list"
        aria-expanded={isOpen && results.length > 0}
        aria-controls={`${id}-results`}
      />

      {error && <small className="field-error" role="alert">{error}</small>}

      {isOpen && results.length > 0 && (
        <div className="city-search-results" id={`${id}-results`} role="listbox">
          {results.map((city) => (
            <button
              key={city.id}
              type="button"
              role="option"
              aria-selected={selectedCity?.id === city.id}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSelect(city)}
            >
              <strong>{city.name}</strong>
              <span>{formatCityLabel(city)}</span>
            </button>
          ))}
        </div>
      )}

      {selectedCity && (
        <div className="city-search-details" aria-live="polite">
          <strong>{formatCityLabel(selectedCity)}</strong>
        </div>
      )}
    </div>
  );
}

export default CitySearch;
