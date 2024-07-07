// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Subscribe from "./pages/Subscribe";
import Customize from "./pages/Customize";
import Confirmation from "./pages/Confirmation"; // Import Confirmation
import { useEmailContext } from "./context/EmailContext";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/subscribe"
          element={useEmailContext === "" ? <Home /> : <Subscribe />}
        />
        <Route
          path="/customize"
          element={useEmailContext === "" ? <Home /> : <Customize />}
        />
        <Route
          path="/confirmation"
          element={useEmailContext === "" ? <Home /> : <Confirmation />}
        />
      </Routes>
    </Router>
  );
}

export default App;
