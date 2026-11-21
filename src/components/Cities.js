import "../styles.css";

const highlightedMetrics = {
  cost_of_living: [
    "average_rent",
    "average_home_price",
    "property_tax_rate",
    "income_needed_to_live_comfortably",
  ],
  economy_employment: [
    "unemployment_rate",
    "tech_job_availability",
    "minimum_wage",
  ],
  safety: ["violent_crime_rate", "property_crime_rate"],
  climate_environment: [
    "natural_disaster_risk",
    "average_annual_temperature",
    "air_quality_index",
  ],
  education: ["public_school_rating", "graduation_rate"],
  lifestyle_entertainment: [
    "restaurants_and_food_variety",
    "bars_and_nightlife",
  ],
  outdoor_recreation: ["parks_and_playgrounds", "hiking_trails"],
  healthcare: ["hospitals"],
  transportation: [
    "average_commute_time",
    "public_transportation",
    "walkability",
  ],
  demographics: ["population", "median_age"],
  housing: ["average_home_size", "hoa_prevalence"],
  business_environment: [
    "business_taxes",
    "commercial_rent",
    "small_business_environment_score",
  ],
  general_quality_of_life: ["cleanliness"],
};

const formatLabel = (key) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function City({ city }) {
  return (
    <div className="city-card">
      <div className="city-card-info">
        <h3 className="city-card-title">{city.name}</h3>
        <span className="city-card-genre">{city.state}</span>
        {Object.entries(highlightedMetrics).map(([categoryKey, metricKeys]) => {
          const category = city.categories?.[categoryKey];
          const availableMetrics = metricKeys.filter(
            (metricKey) => category?.metrics?.[metricKey],
          );

          if (!category || availableMetrics.length === 0) {
            return null;
          }

          return (
            <section key={categoryKey}>
              <h4>{category.label}</h4>
              <dl>
                {availableMetrics.map((metricKey) => {
                  const metric = category.metrics[metricKey];
                  const value =
                    typeof metric.value === "number"
                      ? metric.value.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })
                      : metric.value;

                  return (
                    <div key={metricKey}>
                      <dt>{formatLabel(metricKey)}</dt>
                      <dd>
                        {value} {metric.unit}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </section>
          );
        })}
      </div>
    </div>
  );
}
