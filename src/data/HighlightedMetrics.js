const highlightedMetrics = {
  general: {
    label: "General Information",
    metrics: [
      "population",
      "median_age",
      "median_household_income",
      "unemployment_rate",
    ],
  },

  cost_of_living: {
    label: "Cost of Living",
    metrics: [
      "median_home_value",
      "median_gross_rent",
      "median_annual_property_tax",
      "cost_of_living_index",
      "state_income_tax",
      "unemployment_rate",
      "annual_income_needed_for_basic_needs",
    ],
  },

  housing: {
    label: "Housing",
    metrics: [
      "median_home_value",
      "median_gross_rent",
      "mediam_house_income",
      "homeownership_rate",
    ],
  },

  economy_employment: {
    label: "Economy & Employment",
    metrics: [
      "unemployment_rate",
      "median_household_income",
      "minimum_wage",
      "tech_job_availability",
      "poverty_rate",
    ],
  },

  safety: {
    label: "Safety",
    metrics: [
      "violent_crime_rate",
      "total_offenses",
      "property_crime_rate",
      "murder_rate",
      "robbery_rate",
      "aggravated_assault_rate",
      "burglary_rate",
      "motor_vehicle_theft_rate",
    ],
  },

  education: {
    label: "Education",
    metrics: ["bachelors_degree", "high_school_graduate"],
  },

  transportation: {
    label: "Transportation",
    metrics: ["average_commute_time", "public_transportation", "walk_to_work"],
  },

  climate_environment: {
    label: "Climate & Environment",
    metrics: [
      "spring_high",
      "spring_low",
      "summer_high",
      "summer_low",
      "fall_high",
      "fall_low",
      "winter_high",
      "winter_low",
    ],
  },
};

export default highlightedMetrics;
