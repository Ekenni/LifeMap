import "../styles.css";
import { useState } from "react";

export default function Search({
  search,
  setSearch,
  cityData,
  onSelectCity,
  placeholder,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

  const filteredCities = cityData.filter((city) => {
    const cityName = normalize(`${city.name} ${city.state}`);
    const searchValue = normalize(search);

    return cityName.includes(searchValue);
  });

  const handleChange = (e) => {
    setSearch(e.target.value);
    onSelectCity(null);
    setIsOpen(true);
  };

  const handleSelect = (city) => {
    setSearch(`${city.name}, ${city.state}`);
    onSelectCity(city);
    setIsOpen(false);
  };

  return (
    <form className="search-container" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        onChange={handleChange}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        value={search.name || search}
      />

      {isOpen && search.trim() !== "" && (
        <div className="search-dropdown">
          {filteredCities.length > 0 ? (
            filteredCities.slice(0, 8).map((city) => (
              <button
                type="button"
                key={city.id}
                onClick={() => handleSelect(city)}
                className="search-option"
              >
                {city.name}, {city.state}
              </button>
            ))
          ) : (
            <div className="no-results">No cities found</div>
          )}
        </div>
      )}
    </form>
  );
}
