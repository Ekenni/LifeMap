import "../styles.css";
import Search from "./Search";
import City from "./Cities";
import { useEffect, useState } from "react";
import { getAllCities, getCityDetails } from "../services/censusApi";

export default function CompareCities() {
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
      } catch (error) {
        setError(error.message);
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
      const cityWithDetails = await getCityDetails(city);
      setSelectedCity1(cityWithDetails);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSelectCity2(city) {
    if (!city) {
      setSelectedCity2(null);
      return;
    }
    try {
      const cityWithDetails = await getCityDetails(city);
      setSelectedCity2(cityWithDetails);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      {loadingCities && <p>Loading cities...</p>}
      {error && <p>Error loading cities: {error}</p>}
      <div className="comparison-container">
        <div className="comparison-column">
          <h2>City 1</h2>

          <Search
            search={search1}
            setSearch={setSearch1}
            cityData={cityData}
            onSelectCity={handleSelectCity1}
            placeholder="Search first city..."
          />

          {selectedCity1 ? (
            <City city={selectedCity1} />
          ) : (
            <div className="empty-city">Search and select a city</div>
          )}
        </div>
        <div className="comparison-column">
          <h2>City 2</h2>

          <Search
            search={search2}
            setSearch={setSearch2}
            cityData={cityData}
            onSelectCity={handleSelectCity2}
            placeholder="Search second city..."
          />

          {selectedCity2 ? (
            <City city={selectedCity2} />
          ) : (
            <div className="empty-city">Search and select a city</div>
          )}
        </div>
      </div>
    </div>
  );
}
