const BASE_URL = "https://api.census.gov/data/2024/acs/acs5/profile";
const API_KEY = "&key=25c2291344074c4777e3123e90910df3aa1cf172";

// Load the nationwide list of Census places
export async function getAllCities() {
  const url = `${BASE_URL}?get=NAME&for=place:*&in=state:*${API_KEY}`;

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
    `${BASE_URL}?get=NAME,DP05_0001E,DP05_0018E,DP04_0089E,DP04_0134E,DP03_0009E,DP03_0062E,DP03_0128PE,DP04_0046PE,DP02_0068PE,DP02_0067PE,DP03_0009PE,DP03_0062E,DP03_0025E,DP03_0021PE,DP03_0022PE` +
    `&for=place:${city.placeCode}` +
    `&in=state:${city.stateCode}` +
    `${API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not load data for ${city.name}`);
  }

  const data = await response.json();

  const headers = data[0];
  const values = data[1];

  const nameIndex = headers.indexOf("NAME");

  // General Information
  const population = Number(values[headers.indexOf("DP05_0001E")]);
  const medianAge = Number(values[headers.indexOf("DP05_0018E")]);

  // Cost of Living
  const homeValue = Number(values[headers.indexOf("DP04_0089E")]);
  const medianRent = Number(values[headers.indexOf("DP04_0134E")]);

  // Housing
  const medianHouseIncome = Number(values[headers.indexOf("DP03_0062E")]);
  const homeOwnership = Number(values[headers.indexOf("DP04_0046PE")]);

  //Economy & Employment
  const povertyRate = Number(values[headers.indexOf("DP03_0128PE")]);
  const unemploymentRate = Number(values[headers.indexOf("DP03_0009PE")]);
  const householdIncome = Number(values[headers.indexOf("DP03_0062E")]);

  //Education
  const bachelorsDegree = Number(values[headers.indexOf("DP02_0068PE")]);
  const highSchoolGrad = Number(values[headers.indexOf("DP02_0067PE")]);

  //Transportation
  const averageCommute = Number(values[headers.indexOf("DP03_0025E")]);
  const publicTransportation = Number(values[headers.indexOf("DP03_0021PE")]);
  const walkToWork = Number(values[headers.indexOf("DP03_0022PE")]);

  return {
    ...city,
    censusName: values[nameIndex],

    categories: {
      general: {
        label: "General Information",

        metrics: {
          population: {
            value: population,
            unit: "people",
          },

          median_age: {
            value: medianAge,
            unit: "years",
          },
        },
      },
      cost_of_living: {
        label: "Cost of Living",
        metrics: {
          median_home_value: {
            value: homeValue,
            unit: "dollars",
          },
          median_gross_rent: {
            value: medianRent,
            unit: "dollars/month",
          },
        },
      },
      housing: {
        label: "Housing",
        metrics: {
          median_home_value: {
            value: homeValue,
            unit: "dollars",
          },
          median_gross_rent: {
            value: medianRent,
            unit: "dollars/month",
          },
          median_house_income: {
            value: medianHouseIncome,
            unit: "dollar/month",
          },

          homeownership_rate: {
            value: homeOwnership,
            unit: "%",
          },
        },
      },
      economy_employment: {
        label: "Economy & Employment",
        metrics: {
          poverty_rate: {
            value: povertyRate,
            unit: "%",
          },
          unemployment_rate: {
            value: unemploymentRate,
            unit: "%",
          },
          median_household_income: {
            value: householdIncome,
            unit: "dollar",
          },
        },
      },
      education: {
        label: "Education",
        metrics: {
          bachelors_degree: {
            value: bachelorsDegree,
            unit: "%",
          },
          high_school_graduate: {
            value: highSchoolGrad,
            unit: "%",
          },
        },
      },
      transportation: {
        label: "Transportation",
        metrics: {
          average_commute_time: {
            value: averageCommute,
            unit: "Minutes",
          },
          public_transportation: {
            value: publicTransportation,
            unit: "%",
          },
          walk_to_work: {
            value: walkToWork,
            unit: "%",
          },
        },
      },
    },
  };
}
