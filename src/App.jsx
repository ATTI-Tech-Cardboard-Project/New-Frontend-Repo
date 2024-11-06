import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './Pages/Drawing/Dashboard'
import HomePage from './Pages/landing/Landing'
import Audio from './Components/Setting and Profile components/Audio'
import Landing from './Pages/landing/Landing'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create-art" element={<Dashboard />} />
        <Route path="/audio" element={<Audio />} />
        <Route path="/home-page" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
