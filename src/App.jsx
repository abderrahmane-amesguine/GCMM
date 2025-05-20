import React, { useState, useEffect } from 'react';
import { DataContext } from './context/DataContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FileUploadModal from './components/FileUploadModal';
import Dashboard from './views/Dashboard';
import AxisView from './views/AxisView';
import DomainView from './views/DomainView';
import ObjectiveView from './views/ObjectiveView';
import { Toaster, ToastProvider, toast } from './components/ui/Toast';
import GCMMDashboard from './views/GCMMDashboard';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openFileUpload = () => {
    setIsFileUploadOpen(true);
  };

  const handleFileUpload = (file) => {
    // Pour cette démo, on ferme simplement le modal
    setIsFileUploadOpen(false);
    toast({
      title: "Fichier importé avec succès",
      description: `${file.name} a été importé.`,
      type: "success",
    });
  };

  const exportData = () => {
    // Dans une implémentation réelle, nous exporterions les données ici
    toast({
      title: "Export des données",
      description: "Le téléchargement de vos données va démarrer sous peu.",
      type: "info",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col text-slate-800 font-sans">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 relative">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          openFileUpload={openFileUpload}
          exportData={exportData}
        />
        <main className="flex-1 transition-all duration-300 ease-in-out">
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
      <ToastProvider>
        <Toaster />
      </ToastProvider>
    </div>
  );
};

// Composant pour afficher le contenu en fonction de la vue actuelle
const AppContent = () => {
  const context = React.useContext(DataContext) || {};
  const { currentView = '', loaded = true, loading = false } = context;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700">Chargement des données...</h2>
        <div className="mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
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
    case 'gcmm':
      return <GCMMDashboard />;
    default:
      return <Dashboard />;
  }
};

export default App;