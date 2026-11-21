import react from "react";
import "../styles.css";

export default function Header() {
  return (
    <div className="header">
      <img className="logo" src="logo.png" alt="Lifemap"></img>
      <ul>
        <li>
          <a href="home">Home</a>
        </li>
        <li>
          <a href="compare">Compare Cities</a>
        </li>
        <li>
          <a href="find">Find my city</a>
        </li>
      </ul>
    </div>
  );
}
