import logo from "./logo.svg";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Routers from "./components/Router/Router";

function App() {
  return (
    <Router>
      <Header />
      <Routers />
    </Router>
  );
}

export default App;