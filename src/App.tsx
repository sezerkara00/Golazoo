import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LiveMatches from './pages/LiveMatches';
import DailyMatches from './pages/DailyMatches';
import MatchPage from './pages/MatchPage';
import MatchDetails from './pages/MatchDetails';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<DailyMatches />} />
        <Route path="/matches" element={<DailyMatches />} />
        <Route path="/live" element={<LiveMatches />} />
        <Route path="/match/:id" element={<MatchPage />} />
        <Route path="/match/details/:id" element={<MatchDetails />} />
      </Routes>
    </div>
  );
}

export default App; 