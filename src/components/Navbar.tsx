import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-white font-bold text-xl">
            GOLAZOO
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-300 hover:text-white">
              Günlük Maçlar
            </Link>
            <Link to="/live" className="text-gray-300 hover:text-white">
              Canlı Skorlar
            </Link>
            <Link to="/admin" className="text-gray-300 hover:text-white">
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 