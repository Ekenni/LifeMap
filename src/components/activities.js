import { useEffect, useState } from "react";

export default function Activities() {
  function loadActivity() {
    fetch("https://www.boredapi.com/api/activity")
      .then((response) => response.json())
      .then((data) => {
        setLoading(true);
        setActivity(data.activity);
        setLoading(false);
      });
  }

  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadActivity();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Activities</h1>
      <p>{activity}</p>
      <button disabled={loading} onClick={loadActivity}>
        Get New Activity
      </button>
    </div>
  );
}
