import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Themes from "./components/Themes";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Portfolio from "./pages/portfolio/Portfolio";
import Contact from "./pages/contact/Contact";
import FloatingShapes from "./components/FloatingShapes";
import RandomBubbles from "./components/Bubbles";

function App() {
  return (
    <BrowserRouter>
      <div id="app">
        {/* common */}
        <FloatingShapes /> 
        {/* <RandomBubbles />  */}
        <Navbar />
        <Themes />

        <Routes></Routes>
        <Home index />
        <About />
        <Portfolio />
        <Contact />
      </div>
    </BrowserRouter>
  );
}

export default App;
