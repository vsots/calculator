import { Link, BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BasicCalculator from "./BasicCalculator";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="links">
        <Link to="/basic" className="link-item">
          Basic Calculator
        </Link>
        <Link to="/graphic" className="link-item">
          Graphic Calculator
        </Link>
      </div>
      <Routes>
        <Route index element={<Navigate to="/basic" />} />
        <Route path="basic" element={<BasicCalculator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
