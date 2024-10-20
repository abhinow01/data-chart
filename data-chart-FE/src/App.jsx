import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BarLineChart from './BarLineChart'; 
import Login from './Login'; 
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
