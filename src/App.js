import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import City from "./components/Cities";
import cityData from "./build/city.json";

function App() {
  return (
    <div className="App">
      <div className="container">
        <Header></Header>
        <div className="cities-grid">
          {cityData.cities.map((city) => (
            <City city={city} key={city.id} />
          ))}
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
}

export default App;
