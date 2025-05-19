import React, { useContext } from 'react';
import { X, Upload, Download } from 'lucide-react';
import { DataContext } from '../context/DataContext';

const Sidebar = ({ isOpen, toggleSidebar, openFileUpload, exportData }) => {
  const { axes, handleNavigate } = useContext(DataContext);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-40 transition-base" onClick={toggleSidebar}></div>
      <div className="absolute top-0 left-0 h-full w-72 bg-white shadow-2xl rounded-r-2xl transform transition-transform card">
        <div className="p-6 border-b border-slate-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-blue-700">Menu</h2>
            <button onClick={toggleSidebar} className="text-gray-400 hover:text-blue-600 transition-base">
              <X size={20} />
            </button>
          </div>
        </div>
        <nav className="p-6">
          <ul className="space-y-3">
            <li>
              <button 
                onClick={() => {
                  handleNavigate('dashboard');
                  toggleSidebar();
                }}
                className="btn-secondary w-full flex items-center justify-start"
              >
                <span>Tableau de bord</span>
              </button>
            </li>
            {axes.map(axis => (
              <li key={axis.id}>
                <button 
                  onClick={() => {
                    handleNavigate('axis', axis.id);
                    toggleSidebar();
                  }}
                  className="btn-secondary w-full flex items-center justify-start border-l-4"
                  style={{ borderColor: axis.color }}
                >
                  <span>Axe {axis.id}: {axis.name}</span>
                </button>
              </li>
            ))}
            <li className="pt-4 border-t mt-4">
              <button 
                onClick={() => {
                  openFileUpload();
                  toggleSidebar();
                }}
                className="btn-primary w-full flex items-center justify-start"
              >
                <Upload size={16} className="mr-2" />
                <span>Importer des données</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  exportData();
                  toggleSidebar();
                }}
                className="btn-primary w-full flex items-center justify-start"
              >
                <Download size={16} className="mr-2" />
                <span>Exporter les données</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;