import React, { useContext } from 'react';
import { X, Upload, Download, Home, Shield, Activity, FileText, Settings } from 'lucide-react';
import { DataContext } from '../context/DataContext';

const Sidebar = ({ isOpen, toggleSidebar, openFileUpload, exportData }) => {
  const context = useContext(DataContext) || {};
  const {
    axes = [],
    handleNavigate = () => {},
    currentView = '',
    selectedAxis = null
  } = context;
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop overlay with blur effect */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300" 
        onClick={toggleSidebar}
      ></div>
      
      {/* Sidebar panel */}
      <div className="absolute top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center gap-2">
              <Shield className="text-blue-600" size={22} />
              <h2 className="text-xl font-bold text-blue-800">GCMM Platform</h2>
            </div>
            <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-lg hover:bg-white/80 transition-colors text-gray-500 hover:text-blue-600"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Navigation section */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              <SidebarItem 
                icon={<Home size={18} />}
                label="Tableau de bord"
                isActive={currentView === 'dashboard'}
                onClick={() => {
                  handleNavigate('dashboard');
                  toggleSidebar();
                }}
              />
            </div>
            
            <div className="mt-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Axes d'évaluation
              </h3>
              <div className="mt-2 space-y-1">
                {axes.map(axis => (
                  <SidebarItem 
                    key={axis.id}
                    icon={<Activity size={18} />}
                    label={`Axe ${axis.id}: ${axis.name}`}
                    isActive={currentView === 'axis' && selectedAxis === axis.id}
                    borderColor={axis.color}
                    score={axis.score.toFixed(1)}
                    onClick={() => {
                      handleNavigate('axis', axis.id);
                      toggleSidebar();
                    }}
                  />
                ))}
              </div>
            </div>
          </nav>
          
          {/* Footer actions */}
          <div className="p-4 border-t border-slate-100 bg-gray-50">
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  openFileUpload();
                  toggleSidebar();
                }}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors"
              >
                <Upload size={16} />
                <span className="font-medium">Importer</span>
              </button>
              <button 
                onClick={() => {
                  exportData();
                  toggleSidebar();
                }}
                className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 px-4 rounded-lg transition-colors"
              >
                <Download size={16} />
                <span className="font-medium">Exporter</span>
              </button>
            </div>
            
            <button className="w-full mt-3 flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 py-2.5 px-4 rounded-lg transition-colors">
              <Settings size={16} className="text-gray-500" />
              <span className="font-medium text-gray-700">Paramètres</span>
            </button>
            
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText size={14} className="text-gray-500 mr-2" />
                  <span className="text-xs text-gray-600">Documentation</span>
                </div>
                <span className="text-xs text-gray-500">v1.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar item component
const SidebarItem = ({ icon, label, isActive, onClick, borderColor, score }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-50 text-blue-700 font-medium'
          : 'hover:bg-gray-100 text-gray-700'
      } ${borderColor ? 'border-l-2' : ''}`}
      style={{ borderColor: borderColor }}
    >
      <span className={`mr-3 ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
        {icon}
      </span>
      <span className="flex-1 truncate text-left">{label}</span>
      {score && (
        <span className={`ml-2 px-1.5 py-0.5 rounded text-xs font-medium ${
          isActive ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-700'
        }`}>
          {score}
        </span>
      )}
    </button>
  );
};

export default Sidebar;