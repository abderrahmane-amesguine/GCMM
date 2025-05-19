import React, { useState } from 'react';
import { DataProvider, DataContext } from './context/DataContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FileUploadModal from './components/FileUploadModal';
import Dashboard from './views/Dashboard';
import AxisView from './views/AxisView';
import DomainView from './views/DomainView';
import ObjectiveView from './views/ObjectiveView';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const openFileUpload = () => {
    setIsFileUploadOpen(true);
  };
  
  const handleFileUpload = (file) => {
    // Dans une implémentation réelle, nous traiterions le fichier ici
    // Pour cette démo, on ferme simplement le modal
    setIsFileUploadOpen(false);
  };
  
  const exportData = () => {
    // Dans une implémentation réelle, nous exporterions les données ici
    alert('Fonctionnalité d\'export en développement');
  };
  
  return (
    <DataProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex flex-1">
          <Sidebar 
            isOpen={isSidebarOpen} 
            toggleSidebar={toggleSidebar} 
            openFileUpload={openFileUpload}
            exportData={exportData}
          />
          <main className="flex-1">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              <AppContent />
            </div>
          </main>
        </div>
        <FileUploadModal 
          isOpen={isFileUploadOpen} 
          onClose={() => setIsFileUploadOpen(false)}
          onFileUpload={handleFileUpload}
        />
      </div>
    </DataProvider>
  );
};

// Composant pour afficher le contenu en fonction de la vue actuelle
const AppContent = () => {
  const { currentView, loaded, loading } = React.useContext(DataContext);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!loaded) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700">Chargement des données...</h2>
      </div>
    );
  }
  
  switch (currentView) {
    case 'dashboard':
      return <Dashboard />;
    case 'axis':
      return <AxisView />;
    case 'domain':
      return <DomainView />;
    case 'objective':
      return <ObjectiveView />;
    default:
      return <Dashboard />;
  }
};

export default App;