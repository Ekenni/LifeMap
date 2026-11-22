import "../styles.css";

const formatLabel = (key) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function City({ city }) {
  if (!city) {
    return null;
  }
  return (
    <div className="city-card">
      <div className="city-card-info">
        <h3 className="city-card-title">{city.name}</h3>
        <span className="city-card-genre">{city.state}</span>
        <section>
          <h3>Demographics</h3>
          <dl>
            {Object.entries(city.metrics || {}).map(([metricKey, metric]) => {
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
