import React, { useContext } from 'react';
import { X, Upload, Download, Home, Shield, Activity, Table, FileText, Settings } from 'lucide-react';
import { DataContext } from '../context/DataContext';
import { exportNCSecMMToExcel } from '../services/api';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ isOpen, toggleSidebar, openFileUpload, switchView, activeView, viewParams }) => {
  const { t } = useTranslation();
  const context = useContext(DataContext) || {};
  const { axes = [] } = context;
  const handleExport = async () => {
    const { handleExportAction } = context;
    try {
      await handleExportAction(exportNCSecMMToExcel, {
        successMessage: t('sidebar.export.success'),
        errorMessage: t('sidebar.export.error'),
      });
      toggleSidebar();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };
  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${!isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {/* Backdrop overlay with blur effect */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar panel */}
      <div className={`absolute top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Header */}          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center gap-2">
              <Shield className="text-blue-600" size={22} />
              <h2 className="text-xl font-bold text-blue-800">{t('sidebar.title')}</h2>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-white/80 transition-colors text-gray-500 hover:text-blue-600"
              aria-label={t('sidebar.menu.close')}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation section */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              <SidebarItem icon={<Table size={18} />}
                label={t('sidebar.menu.tableView')}
                isActive={activeView === 'NCSecMM-table'}
                onClick={() => {
                  switchView('NCSecMM-table');
                  toggleSidebar();
                }}
              />
              <SidebarItem
                icon={<Home size={18} />}
                label={t('sidebar.menu.dashboard')}
                isActive={activeView === 'NCSecMM'}
                onClick={() => {
                  switchView('NCSecMM');
                  toggleSidebar();
                }}
              />
            </div>
            {/* Axes section */}
            <div className="mt-8">
              <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('sidebar.menu.axes')}
              </h3>
              {axes.map(axis => (
                <SidebarItem
                  key={axis.id}
                  icon={<Shield size={18} />}
                  label={axis.name}
                  isActive={activeView === 'axis' && viewParams?.axisId === axis.id}
                  onClick={() => {
                    switchView('axis', { axisId: axis.id, axisColor: axis.color });
                    toggleSidebar();
                  }}
                  borderColor={axis.color}
                  score={axis.score?.toFixed(1)}
                />
              ))}
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
                <span className="font-medium">{t('sidebar.menu.importData')}</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 bg-green-200 hover:bg-green-300 text-green-700 py-2.5 px-4 rounded-lg transition-colors"
              >
                <Download size={16} />
                <span className="font-medium">{t('sidebar.menu.exportData')}</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar item component
const SidebarItem = ({ icon, label, isActive, onClick, borderColor, score }) => {
  const getStyles = () => {
    const baseStyle = borderColor ? {
      boxShadow: `inset 3px 0 0 ${borderColor}`
    } : {};

    if (!isActive) return baseStyle;

    if (borderColor) {
      // For axis items, use their specific color
      return {
        ...baseStyle,
        background: `${borderColor}15`,
        color: borderColor
      };
    }

    return {
      background: 'linear-gradient(to right, #3b82f6, #6366f1)'
    };
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 mb-2 rounded-2xl
        h-10
                  transition-all duration-200 ease-in-out
                  hover:scale-[1.02]
                  focus:outline-none focus:ring-2 focus:ring-blue-200
                  ${isActive
          ? borderColor
            ? 'font-semibold shadow-md'
            : 'text-white font-semibold shadow-lg'
          : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
        }`}
      style={getStyles()}
    >      <span className={`mr-3 ${isActive
      ? borderColor ? '' : 'text-white'
      : 'text-gray-500'
      }`}
      style={isActive && borderColor ? { color: borderColor } : undefined}>
        {icon}
      </span>      <span
        className="flex-1 truncate text-left"
        style={isActive && borderColor ? { color: borderColor } : undefined}
      >
        {label}
      </span>
      {score && (
        <span
          className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${isActive
            ? borderColor
              ? 'bg-white'
              : 'bg-white/20 text-white'
            : 'bg-gray-100 text-gray-600'
            }`}
          style={isActive && borderColor ? { color: borderColor } : undefined}
        >
          {score}
        </span>
      )}
    </button>
  );
};

export default Sidebar;