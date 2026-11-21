import React from "react";
import "../styles.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <img className="logo" src="logo.png" alt="Lifemap"></img>{" "}
      <p className="copy">
        © {currentYear}
        LifeMap, All rights reserved.
      </p>
    </footer>
  );
}
