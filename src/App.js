import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CompareCities from "./components/CityCompare";
import CensusData from "./services/data";

function App() {
  return (
    <div className="App">
      <div className="container">
        <Header></Header>
        <CompareCities></CompareCities>
        <CensusData></CensusData>
      </div>

      <Footer></Footer>
    </div>
  );
}

export default App;
