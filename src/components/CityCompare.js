import "../styles.css";
import Search from "./Search";
import City from "./Cities";
import { useEffect, useState } from "react";
import highlightedMetrics from "../data/HighlightedMetrics";
import { getClimateData } from "../services/openMetroApi";
import { getCitySafetyData } from "../services/fbiCrimeApi";
import { getAllCities, getCityDetails } from "../services/censusApi";

export default function CompareCities() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [selectedCity1, setSelectedCity1] = useState(null);
  const [selectedCity2, setSelectedCity2] = useState(null);
  const [cityData, setCityData] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function loadCities() {
      try {
        const cities = await getAllCities();
        setCityData(cities);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoadingCities(false);
      }
    }

    loadCities();
  }, []);

  async function handleSelectCity1(city) {
    if (!city) {
      setSelectedCity1(null);
      return;
    }

    try {
      const [censusData, climateData, safetyData] = await Promise.all([
        getCityDetails(city),
        getClimateData(city),
        getCitySafetyData(city),
      ]);

      setSelectedCity1({
        ...censusData,
        categories: {
          ...censusData.categories,
          climate_environment: climateData,
          safety: safetyData,
        },
      });
    } catch (selectError) {
      setError(selectError.message);
    }
  }

  async function handleSelectCity2(city) {
    if (!city) {
      setSelectedCity2(null);
      return;
    }

    try {
      const [censusData, climateData, safetyData] = await Promise.all([
        getCityDetails(city),
        getClimateData(city),
        getCitySafetyData(city),
      ]);

      setSelectedCity2({
        ...censusData,
        categories: {
          ...censusData.categories,
          climate_environment: climateData,
          safety: safetyData,
        },
      });
    } catch (selectError) {
      setError(selectError.message);
    }
  }

  if (loadingCities) {
    return <p>Loading cities...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="city-compare">
      <div className="category-buttons">
        {Object.entries(highlightedMetrics).map(([categoryKey, category]) => (
          <button
            type="button"
            key={categoryKey}
            className={activeCategory === categoryKey ? "active" : ""}
            onClick={() => setActiveCategory(categoryKey)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="city-searches">
        <Search
          search={search1}
          setSearch={setSearch1}
          cityData={cityData}
          onSelectCity={handleSelectCity1}
          placeholder="Search first city..."
        />

        <Search
          search={search2}
          setSearch={setSearch2}
          cityData={cityData}
          onSelectCity={handleSelectCity2}
          placeholder="Search second city..."
        />
      </div>
      <div className="city-comparison">
        {selectedCity1 ? (
          <City city={selectedCity1} activeCategory={activeCategory} />
        ) : (
          <div className="empty-city">Search for your first city</div>
        )}

        {selectedCity2 ? (
          <City city={selectedCity2} activeCategory={activeCategory} />
        ) : (
          <div className="empty-city">Search for your second city</div>
        )}
      </div>
    </div>
  );
}
