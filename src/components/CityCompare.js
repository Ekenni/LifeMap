import React, { useState } from "react";
import "../styles.css";
import City from "./Cities";

export default function CityCompare({ cities }) {
  const [comparedCities, setComparedCities] = useState([]);

  const toggleCompared = (cityID) => {
    setComparedCities((prev) =>
      prev.includes(cityID)
        ? prev.filter((id) => id !== cityID)
        : [...prev, cityID],
    );
  };

  return (
    <div>
      <div className="cities-grid">
        {cities.map((city) => (
          <City
            city={city}
            key={city.id}
            isCompared={comparedCities.includes(city.id)}
            toggleCompared={toggleCompared}
          />
        ))}
      </div>
    </div>
  );
}
