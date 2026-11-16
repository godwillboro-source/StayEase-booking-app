
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useBookings } from "../../context/useBookings";

import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

import PropertySearch from "../../components/customer/PropertySearch";
import PropertyFilters from "../../components/customer/PropertyFilters";
import PropertyGrid from "../../components/customer/PropertyGrid";

const BrowseProperties = () => {
  const { properties = [], loading, error } = useBookings();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("location") || ""
  );
  const [city, setCity] = useState(null);

  const [unitType, setUnitType] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");

  const listedProperties = properties.filter(
    (property) => property.status === "approved"
  );

  const unitTypes = useMemo(
    () => [
      ...new Set(
        listedProperties
          .flatMap((property) => property.units.map((unit) => unit.unitType))
          .filter(Boolean)
      ),
    ],
    [listedProperties]
  );

  const filteredProperties = useMemo(() => {
    return listedProperties.filter((property) => {
      const searchTerm = search.trim().toLowerCase();
      const citySearchable = [
        property.name,
        property.location,
        property.address,
        property.city?.name,
        property.city?.admin1,
        property.city?.country,
        property.city?.countryCode
      ].filter(Boolean).join(" ").toLowerCase();
      const searchTerms = searchTerm.split(/[,\s]+/).filter(Boolean);

      const matchesCity = !city || (
        property.city?.id === city.id ||
        (
          property.city?.name === city.name &&
          property.city?.countryCode === city.countryCode
        ) ||
        (!property.city && property.location?.toLowerCase().includes(city.name.toLowerCase()))
      );

      const matchesSearch =
        !searchTerm ||
        searchTerms.every((term) => citySearchable.includes(term));

      const matchesType = unitType === "all" ||
        property.units.some((unit) => unit.unitType === unitType);

      const prices = (property.units || [])
        .map((unit) => Number(unit.pricePerMonth))
        .filter((price) => Number.isFinite(price));

      const lowestPrice = prices.length
        ? Math.min(...prices)
        : null;

      const matchesPrice =
        maxPrice === "" ||
        (lowestPrice !== null && lowestPrice <= Number(maxPrice));

      return matchesSearch && matchesCity && matchesType && matchesPrice;
    });
  }, [listedProperties, search, city, unitType, maxPrice]);

  const clearFilters = () => {
    setSearch("");
    setCity(null);
    setUnitType("all");
    setMaxPrice("");
  };

  if (loading) {
    return <Loading message="Loading properties..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <main className="customer-page">
      <header className="customer-page-header">
        <div>
          <h1>Browse properties</h1>
          <p>Find accommodation that matches your needs.</p>
        </div>
      </header>

      <section className="customer-search-panel">
        <PropertySearch
          value={search}
          onChange={(value) => {
            setSearch(value);
            setCity(null);
          }}
          selectedCity={city}
          onCitySelect={(selectedCity) => {
            setCity(selectedCity);
            if (selectedCity) {
              setSearch(selectedCity.name);
            }
          }}
          onSearch={(value, selectedCity) => {
            setSearch(selectedCity?.name || value);
            setCity(selectedCity);
          }}
        />

        <PropertyFilters
          unitTypes={unitTypes}
          unitType={unitType}
          onUnitTypeChange={setUnitType}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          onClear={clearFilters}
        />
      </section>

      <section className="customer-property-section">
        <div className="section-heading">
          <h2>Available properties</h2>
          <span>{filteredProperties.length} properties found</span>
        </div>

        {filteredProperties.length === 0 ? (
          <EmptyState
            title="No properties found"
            message="Try changing your search or filters."
          />
        ) : (
          <PropertyGrid properties={filteredProperties} />
        )}
      </section>
    </main>
  );
};

export default BrowseProperties;
