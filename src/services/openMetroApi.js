const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_URL = "https://archive-api.open-meteo.com/v1/archive";

// Convert a city and state into geographic coordinates
async function getCityCoordinates(city) {
  const params = new URLSearchParams({
    name: `${city.name}, ${city.state}`,
    count: "10",
    countryCode: "US",
    language: "en",
    format: "json",
  });

  const response = await fetch(`${GEOCODING_URL}?${params}`);

  if (!response.ok) {
    throw new Error("Could not find city coordinates");
  }

  const data = await response.json();

  const normalize = (value) => value?.toLowerCase().replace(/[^a-z0-9]/g, "");

  const location = data.results?.find(
    (result) =>
      normalize(result.name) === normalize(city.name) &&
      normalize(result.admin1) === normalize(city.state),
  );

  if (!location) {
    throw new Error(
      `Could not find coordinates for ${city.name}, ${city.state}`,
    );
  }

  return {
    latitude: location.latitude,
    longitude: location.longitude,
  };
}

// Get historical climate data for a city
export async function getClimateData(city) {
  const coordinates = await getCityCoordinates(city);

  const params = new URLSearchParams({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    start_date: "2024-01-01",
    end_date: "2024-12-31",
    daily: "temperature_2m_max,temperature_2m_min",
    temperature_unit: "fahrenheit",
    timezone: "auto",
  });

  const response = await fetch(`${WEATHER_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Could not load climate data for ${city.name}`);
  }

  const data = await response.json();
  const daily = data.daily;

  // Calculate the average of an array of numbers
  const average = (values) => {
    const validValues = values.filter(Number.isFinite);

    if (!validValues.length) return null;

    return (
      validValues.reduce((total, value) => total + value, 0) /
      validValues.length
    );
  };

  // Calculate average high or low for a season
  const getSeasonAverage = (values, months) => {
    const seasonalValues = daily.time
      .map((date, index) => ({
        month: Number(date.split("-")[1]),
        value: values[index],
      }))
      .filter(
        (day) => months.includes(day.month) && Number.isFinite(day.value),
      );

    return average(seasonalValues.map((day) => day.value));
  };

  return {
    label: "Climate & Environment",
    metrics: {
      spring_high: {
        value: getSeasonAverage(daily.temperature_2m_max, [3, 4, 5]),
        unit: "°F",
      },
      spring_low: {
        value: getSeasonAverage(daily.temperature_2m_min, [3, 4, 5]),
        unit: "°F",
      },
      summer_high: {
        value: getSeasonAverage(daily.temperature_2m_max, [6, 7, 8]),
        unit: "°F",
      },
      summer_low: {
        value: getSeasonAverage(daily.temperature_2m_min, [6, 7, 8]),
        unit: "°F",
      },
      fall_high: {
        value: getSeasonAverage(daily.temperature_2m_max, [9, 10, 11]),
        unit: "°F",
      },
      fall_low: {
        value: getSeasonAverage(daily.temperature_2m_min, [9, 10, 11]),
        unit: "°F",
      },
      winter_high: {
        value: getSeasonAverage(daily.temperature_2m_max, [12, 1, 2]),
        unit: "°F",
      },
      winter_low: {
        value: getSeasonAverage(daily.temperature_2m_min, [12, 1, 2]),
        unit: "°F",
      },
    },
  };
}
