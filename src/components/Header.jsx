import React, { useContext } from 'react';
import { Menu, X } from 'lucide-react';
import { DataContext } from '../context/DataContext';

const Header = ({ toggleSidebar }) => {
  const { globalScore, loaded } = useContext(DataContext);
  
  return (
    <header className="bg-white/90 shadow-md border-b border-slate-200 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="mr-4 p-2 rounded-md hover:bg-blue-100 transition-base shadow-sm lg:hidden"
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
          <div>
            <h1 className="header-title">GCMM Platform</h1>
            <p className="text-gray-400 text-sm font-medium">Global Cybersecurity Maturity Model</p>
          </div>
        </div>
        
        {loaded && (
          <div className="flex items-center space-x-4 bg-blue-50 px-4 py-2 rounded-lg shadow-card">
            <div className="text-sm text-gray-500">Score Global:</div>
            <div className="text-2xl font-extrabold text-blue-700">{globalScore}/5</div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;