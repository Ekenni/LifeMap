import "../styles.css";
import highlightedMetrics from "../data/HighlightedMetrics";

const formatLabel = (key) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function City({ city, activeCategory }) {
  if (!city) {
    return null;
  }

  // Get the selected category's information
  const category = highlightedMetrics[activeCategory];

  // Get the metric names assigned to this category
  const metricKeys = category?.metrics || [];

  // Get the actual metric values from the selected city
  const cityMetrics = city.categories?.[activeCategory]?.metrics || {};
  console.log("Metric keys:", metricKeys);
  console.log("Metric values:", cityMetrics);
  console.log("Active category:", activeCategory);
  return (
    <div className="city-card">
      <div className="city-card-info">
        <h3 className="city-card-title">{city.name}</h3>
        <span className="city-card-genre">{city.state}</span>

        <section>
          <h3>{category?.label || "City Information"}</h3>

          <dl>
            {metricKeys.map((metricKey) => {
              const metric = cityMetrics[metricKey];

              // Don't display metrics that don't have data yet
              if (metric?.value == null) {
                return null;
              }

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
      </div>
    </div>
  );
}
