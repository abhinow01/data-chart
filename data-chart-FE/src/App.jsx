import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BarLineChart from './BarLineChart'; // Make sure this path is correct
import Login from './Login'; // Example for other routes
import Home from './Home';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home/>} />
        <Route path="/chart" element={<BarLineChart />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
