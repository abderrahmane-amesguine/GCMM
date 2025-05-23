import React, { useState, useContext } from 'react';
import { DataProvider, DataContext } from './context/DataContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FileUploadModal from './components/FileUploadModal';
import Dashboard from './views/Dashboard';
import AxisView from './views/AxisView';
import DomainView from './views/DomainView';
import ObjectiveView from './views/ObjectiveView';
import GCMMTable from './views/GCMMTable';
import { Toaster, ToastProvider } from './components/ui/Toast';

// App content component that uses the DataContext
const AppContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);  
  const [activeView, setActiveView] = useState('gcmm');
  const [viewParams, setViewParams] = useState({});
  
  const context = useContext(DataContext);
  const { handleFileUpload, loading } = context;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openFileUpload = () => {
    setIsFileUploadOpen(true);
  };

  const onFileUpload = async (file) => {
    await handleFileUpload(file);
    setIsFileUploadOpen(false);
    setActiveView('gcmm-table');
    setViewParams({});
  };

  const exportData = () => {
    const dataStr = JSON.stringify(context);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = 'gcmm-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleNavigate = (view, params = {}) => {
    setActiveView(view);
    setViewParams(params);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'gcmm-table':
        return <GCMMTable onNavigate={handleNavigate} />;
      case 'gcmm':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'axis':
        return <AxisView axisId={viewParams.axisId} onNavigate={handleNavigate} />;
      case 'domain':
        return <DomainView axisId={viewParams.axisId} domainId={viewParams.domainId} onNavigate={handleNavigate} />;
      case 'objective':
        return <ObjectiveView 
          axisId={viewParams.axisId} 
          domainId={viewParams.domainId} 
          objectiveId={viewParams.objectiveId} 
          onNavigate={handleNavigate}
        />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col text-slate-800 font-sans">
      <Header 
        toggleSidebar={toggleSidebar} 
        switchView={handleNavigate} 
        activeView={activeView}
      />
      <div className="flex flex-1 relative">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          openFileUpload={openFileUpload}
          exportData={exportData}
          switchView={handleNavigate}
          activeView={activeView}
          viewParams={viewParams}
        />
        <main className="flex-1 transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {renderView()}
          </div>
        </main>
      </div>
      <FileUploadModal
        isOpen={isFileUploadOpen}
        onClose={() => setIsFileUploadOpen(false)}
        onFileUpload={onFileUpload}
      />
      <Toaster position="top-right" />
    </div>
  );
};

// Main App component with the DataProvider
const App = () => {
  return (
    <ToastProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ToastProvider>
  );
};

export default App;