import React, { useState, useContext, useEffect } from 'react';
import { DataProvider, DataContext } from './context/DataContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FileUploadModal from './components/FileUploadModal';
import WelcomeScreen from './views/WelcomeScreen';
import Dashboard from './views/Dashboard';
import AxisView from './views/AxisView';
import DomainView from './views/DomainView';
import ObjectiveView from './views/ObjectiveView';
import NCSecMMTable from './views/NCSecMMTable';
import NCSecMMBuilder from './views/NCSecMMBuilder';
import { Toaster, ToastProvider, toast } from './components/ui/Toast';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import { downloadNCSecMMTemplate, exportNCSecMMToExcel } from './services/api';

// App content component that uses the DataContext
const AppContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [activeView, setActiveView] = useState('NCSecMM');
  const [viewParams, setViewParams] = useState({});

  const context = useContext(DataContext);
  const { handleFileUpload, loading, axes, hasUnsavedChanges } = context;

  const openFileUpload = () => {
    if (hasUnsavedChanges) {
      const confirmUpload = window.confirm(
        "Vous avez des modifications non sauvegardées. Voulez-vous continuer?"
      );
      if (!confirmUpload) return;
    }
    setIsFileUploadOpen(true);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'o',
      ctrl: true,
      action: openFileUpload,
      description: 'Ouvrir le dialogue d\'import'
    },
    {
      key: 's',
      ctrl: true,
      action: async () => {
        try {
          await exportNCSecMMToExcel();
          context.markDataAsSaved();
          toast({
            title: "Export réussi",
            description: "Les données ont été exportées et marquées comme sauvegardées",
            type: "success"
          });
        } catch (error) {
          toast({
            title: "Erreur d'export",
            description: "Impossible d'exporter les données",
            type: "error"
          });
        }
      },
      description: 'Exporter les données'
    },
    {
      key: 'd',
      ctrl: true,
      action: () => handleNavigate('NCSecMM'),
      description: 'Aller au tableau de bord'
    },
    {
      key: 'g',
      ctrl: true,
      action: () => handleNavigate('NCSecMM-table'),
      description: 'Aller à la table NCSecMM'
    }
  ]);

  // Check if we have data
  const hasData = axes && axes.length > 0;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const onFileUpload = async (file) => {
    try {
      await handleFileUpload(file);
      setIsFileUploadOpen(false);
      setActiveView('dashboard');
      setViewParams({});
    } catch (error) {
      // Error is already handled in context
      if (error.message !== "Upload cancelled by user") {
        console.error('Upload error:', error);
        toast({
          title: "Erreur d'import",
          description: "Une erreur s'est produite lors de l'importation du fichier",
          type: "error"
        });
      }
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadNCSecMMTemplate();
      toast({
        title: "Template téléchargé",
        description: "Le fichier template NCSecMM a été téléchargé avec succès",
        type: "success"
      });
    } catch (error) {
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger le template",
        type: "error"
      });
    }
  };

  const handleNavigate = (view, params = {}) => {
    setActiveView(view);
    setViewParams(params);
  };
  // Show welcome screen if no data, except for NCSecMM-builder
  if (!loading && !hasData && activeView !== 'NCSecMM-builder') {
    return (
      <>
        <WelcomeScreen
          onFileUpload={onFileUpload}
          onDownloadTemplate={handleDownloadTemplate}
          onNavigate={handleNavigate}
        />
      </>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }
  const renderView = () => {
    switch (activeView) {
      case 'NCSecMM-builder':
        return <NCSecMMBuilder onNavigate={handleNavigate} />;
      case 'NCSecMM-table':
        return <NCSecMMTable onNavigate={handleNavigate} />;
      case 'NCSecMM':
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

// Main App component with providers
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