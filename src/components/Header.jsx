import React, { useContext } from 'react';
import { Menu, Shield, AlertCircle, Info } from 'lucide-react';
import { DataContext } from '../context/DataContext';
import { getScoreBadgeClass } from '../utils/colors';

const Header = ({ toggleSidebar }) => {
  const context = useContext(DataContext) || {};
  const { globalScore = 0, loaded = false, axes = [] } = context;
  
  // Format the score for display
  const displayScore = loaded ? parseFloat(globalScore).toFixed(1) : "0.0";
  const scorePercentage = loaded ? (parseFloat(globalScore) / 5) * 100 : 0;
  const badgeClass = getScoreBadgeClass(parseFloat(displayScore));
  
  return (
    <header className="bg-white/80 shadow-md backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="mr-4 p-2 rounded-lg hover:bg-blue-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Menu"
            >
              <Menu size={24} className="text-blue-700" />
            </button>
            <div className="flex items-center gap-3">
              <Shield size={32} className="text-blue-600 hidden sm:block" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">
                  GCMM Platform
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm">Global Cybersecurity Maturity Model</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {loaded && (
              <div className="group relative">
                <div className={`flex items-center gap-2 ${badgeClass} px-4 py-2 rounded-lg shadow-lg transition-all cursor-help`}>
                  <div>
                    <div className="text-xs uppercase font-semibold tracking-wider">Score Global</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold">{displayScore}</span>
                      <span className="text-sm font-medium opacity-80">/5</span>
                    </div>
                  </div>
                  <div className="h-10 w-10 relative">
                    <svg className="h-10 w-10 rotate-[-90deg]">
                      <circle
                        className="text-gray-300"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="transparent"
                        r="16"
                        cx="20"
                        cy="20"
                      />
                      <circle
                        className={`text-current`}
                        strokeWidth="4"
                        strokeDasharray={100.53} // 2πr
                        strokeDashoffset={100.53 - scorePercentage / 100 * 100.53}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="16"
                        cx="20"
                        cy="20"
                      />
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-bold">
                      {Math.round(scorePercentage)}%
                    </div>
                  </div>
                </div>
                
                {/* Tooltip panel */}
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <h3 className="font-semibold mb-2 flex items-center gap-1">
                    <Info size={14} /> Détails du score
                  </h3>
                  <div className="space-y-2">
                    {loaded && axes.map(axis => (
                      <div key={axis.id} className="flex justify-between items-center">
                        <span className="text-sm flex items-center">
                          <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: axis.color }}></span>
                          Axe {axis.id}
                        </span>
                        <span className="font-medium">{axis.score.toFixed(1)}/5</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 text-sm shadow transition-all hidden sm:block">
              <AlertCircle size={16} className="inline-block mr-1" /> Rapport
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;