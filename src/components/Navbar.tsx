import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">GOLAZO</Link>
        
        <div className="flex gap-4">
          <Link to="/matches" className="hover:text-gray-300">Günlük Maçlar</Link>
          <Link to="/live" className="hover:text-gray-300">Canlı Skorlar</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 