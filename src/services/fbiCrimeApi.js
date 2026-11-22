const BASE_URL = "https://api.usa.gov/crime/fbi/cde";
const API_KEY = "NWbwQBznWK89hF7C69rMHpjq9LjNGbM6Qbkz6Qr8";
const STATE_ABBREVIATIONS_BY_FIPS = {
  "01": "AL",
  "02": "AK",
  "04": "AZ",
  "05": "AR",
  "06": "CA",
  "08": "CO",
  "09": "CT",
  10: "DE",
  11: "DC",
  12: "FL",
  13: "GA",
  15: "HI",
  16: "ID",
  17: "IL",
  18: "IN",
  19: "IA",
  20: "KS",
  21: "KY",
  22: "LA",
  23: "ME",
  24: "MD",
  25: "MA",
  26: "MI",
  27: "MN",
  28: "MS",
  29: "MO",
  30: "MT",
  31: "NE",
  32: "NV",
  33: "NH",
  34: "NJ",
  35: "NM",
  36: "NY",
  37: "NC",
  38: "ND",
  39: "OH",
  40: "OK",
  41: "OR",
  42: "PA",
  44: "RI",
  45: "SC",
  46: "SD",
  47: "TN",
  48: "TX",
  49: "UT",
  50: "VT",
  51: "VA",
  53: "WA",
  54: "WV",
  55: "WI",
  56: "WY",
  72: "PR",
};

export async function getAgencies(stateAbbr) {
  const params = new URLSearchParams({
    api_key: API_KEY,
  });

  const response = await fetch(
    `${BASE_URL}/agency/byStateAbbr/${stateAbbr}?${params}`,
  );

  if (!response.ok) {
    throw new Error("Could not load FBI agency data");
  }

  const data = await response.json();

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("FBI agency response had an unexpected format");
  }

  if (Array.isArray(data.results)) {
    return data.results;
  }

  return Object.entries(data).flatMap(([county, agencyList]) => {
    if (!Array.isArray(agencyList)) {
      throw new Error(`FBI agency response for ${county} was not a list`);
    }

    return agencyList.map((agency) => ({ ...agency, county }));
  });
}

export async function getCityAgency(city) {
  const stateCode = String(city.stateCode).padStart(2, "0");
  const stateAbbr = STATE_ABBREVIATIONS_BY_FIPS[stateCode];

  if (!stateAbbr) {
    throw new Error(`FBI agency lookup is not supported for ${city.state}`);
  }

  const agencies = await getAgencies(stateAbbr);

  const cityAgency = agencies.find(
    (agency) =>
      agency.agency_type_name === "City" &&
      agency.agency_name.toLowerCase() ===
        `${city.name} police department`.toLowerCase(),
  );

  if (!cityAgency) {
    return null;
  }

  return cityAgency;
}

function calculateAnnualMetrics(data, agencyName, year) {
  // Build the property names used in the FBI response
  const offenseLabel = `${agencyName} Offenses`;

  const monthlyCounts = data.offenses.actuals?.[offenseLabel];

  if (!monthlyCounts) {
    throw new Error(`No crime data found for ${agencyName}`);
  }

  // Get only the months belonging to the requested year
  const months = Object.keys(monthlyCounts).filter((month) =>
    month.endsWith(`-${year}`),
  );

  if (months.length !== 12) {
    throw new Error(`Incomplete crime data for ${agencyName} in ${year}`);
  }

  // Add all 12 months of offenses together
  const totalOffenses = months.reduce(
    (total, month) => total + Number(monthlyCounts[month]),
    0,
  );

  // Get the agency's reported population
  const population = data.populations.population[agencyName]?.[months[0]];

  if (!population || population <= 0) {
    throw new Error(`Population data unavailable for ${agencyName}`);
  }

  // Calculate annual offenses per 100,000 residents
  const annualRate = (totalOffenses / population) * 100000;

  return {
    total_offenses: {
      value: totalOffenses,
      unit: "offenses this year",
    },
    violent_crime_rate: {
      value: Number(annualRate.toFixed(2)),
      unit: "per 100,000 residents",
    },
  };
}

export async function getCrimeData(ori, crimeType, year) {
  const params = new URLSearchParams({
    from: `01-${year}`,
    to: `12-${year}`,
    api_key: API_KEY,
  });

  const response = await fetch(
    `${BASE_URL}/summarized/agency/${ori}/${crimeType}?${params}`,
  );

  if (!response.ok) {
    const errorDetails = await response.text();
    console.error("FBI crime data response:", errorDetails);
    throw new Error(`Could not load crime data: ${response.status}`);
  }

  const data = await response.json();

  return data;
}

export async function getCitySafetyData(city) {
  const year = 2024;

  // Find the city's police department
  const agency = await getCityAgency(city);

  if (!agency) {
    return null;
  }

  // Fetch the department's violent crime data
  const crimeData = await getCrimeData(agency.ori, "violent-crime", year);

  // Calculate the annual crime metrics
  const safetyMetrics = calculateAnnualMetrics(
    crimeData,
    agency.agency_name,
    year,
  );

  // Return data in the format our React components expect
  return {
    label: "Safety",
    metrics: safetyMetrics,
  };
}
