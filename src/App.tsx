import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LiveMatches from './pages/LiveMatches';
import DailyMatches from './pages/DailyMatches';
import MatchPage from './pages/MatchPage';
import MatchDetails from './pages/MatchDetails';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<DailyMatches />} />
          <Route path="/matches" element={<DailyMatches />} />
          <Route path="/live" element={<LiveMatches />} />
          <Route path="/match/:matchId" element={<MatchPage />} />
          <Route path="/match/details/:id" element={<MatchDetails />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App; 