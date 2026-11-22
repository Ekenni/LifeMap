const BASE_URL = "https://api.census.gov/data/2024/acs/acs5/profile";

// Load the nationwide list of Census places
export async function getAllCities() {
  const url = `${BASE_URL}?get=NAME&for=place:*&in=state:*&key=25c2291344074c4777e3123e90910df3aa1cf172`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Could not load the city list");
  }

  const data = await response.json();

  // Remove the header row
  const rows = data.slice(1);

  // Convert each API row into a city object
  return rows.map((row) => {
    const [fullName, stateCode, placeCode] = row;

    const [placeName, stateName] = fullName.split(", ");

    return {
      id: `${stateCode}-${placeCode}`,
      name: placeName.replace(/\s+(city|town|village|CDP)$/i, ""),
      state: stateName,
      stateCode,
      placeCode,
    };
  });
}

// 2. Load statistics for one selected city
export async function getCityDetails(city) {
  const url =
    `${BASE_URL}?get=NAME,DP05_0001E&key=25c2291344074c4777e3123e90910df3aa1cf172` +
    `&for=place:${city.placeCode}` +
    `&in=state:${city.stateCode}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not load data for ${city.name}`);
  }

  const data = await response.json();

  const headers = data[0];
  const values = data[1];

  const nameIndex = headers.indexOf("NAME");
  const populationIndex = headers.indexOf("DP05_0001E");

  const population = Number(values[populationIndex]);

  return {
    ...city,
    censusName: values[nameIndex],
    population,

    metrics: {
      population: {
        value: population,
        unit: "people",
      },
    },
  };
}
