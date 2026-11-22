import { useEffect, useState } from "react";

export default function CensusData() {
  function loadCensusData() {
    fetch(
      "https://api.census.gov/data/2024/acs/acs5/profile?get=NAME,DP02_0001E,DP02_0001PE&for=us:1&key=25c2291344074c4777e3123e90910df3aa1cf172",
    )
      .then((response) => response.json())
      .then((data) => {
        setCensusData(data);
      });
  }

  const [censusData, setCensusData] = useState([]);
  useEffect(() => {
    loadCensusData();
  }, []);

  return (
    <div>
      <p>Location: {censusData[1]?.[0]}</p>
      <p>Population: {censusData[1]?.[1]}</p>
    </div>
  );
}
