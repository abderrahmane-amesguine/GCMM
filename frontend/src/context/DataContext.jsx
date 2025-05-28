import React, { createContext, useState, useEffect, useCallback } from 'react';
import { fetchGCMMData, uploadExcelFile } from '../services/api';
import { toast } from '../components/ui/Toast';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    axes: [],
    domains: [],
    objectives: [],
    radarData: [],
    loaded: false,
    currentView: 'gcmm-table',
    selectedAxis: null,
    selectedDomain: null,
    selectedObjective: null
  });
  
  const [globalScore, setGlobalScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  // Track changes
  const trackChanges = useCallback(() => {
    if (originalData) {
      const currentDataStr = JSON.stringify({
        axes: data.axes,
        domains: data.domains,
        objectives: data.objectives
      });
      const originalDataStr = JSON.stringify({
        axes: originalData.axes,
        domains: originalData.domains,
        objectives: originalData.objectives
      });
      
      const hasChanges = currentDataStr !== originalDataStr;
      setHasUnsavedChanges(hasChanges);
    }
  }, [data, originalData]);

  // Call trackChanges whenever data changes
  useEffect(() => {
    trackChanges();
  }, [data, trackChanges]);

  // Function to load data from API
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetchGCMMData();
      
      const newData = {
        axes: response.axes || [],
        domains: response.domains || [],
        objectives: response.objectives || [],
        radarData: response.radarData || [],
        loaded: true
      };

      setData(prevData => ({
        ...prevData,
        ...newData
      }));
      
      // Store original data for comparison
      setOriginalData({
        axes: response.axes || [],
        domains: response.domains || [],
        objectives: response.objectives || []
      });
      
      setGlobalScore(response.globalScore || 0);
      setHasUnsavedChanges(false);
      
      toast({
        title: "Données chargées",
        description: "Les données GCMM ont été chargées avec succès",
        type: "success"
      });
    } catch (error) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données. Veuillez réessayer.",
        type: "error",
        duration: 7000
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data on initial render
  useEffect(() => {
    loadData();
  }, []);

  // Function to handle file upload with unsaved changes check
  const handleFileUpload = async (file, forceUpload = false) => {
    // Check for unsaved changes
    if (hasUnsavedChanges && !forceUpload) {
      return new Promise((resolve, reject) => {
        const confirmUpload = window.confirm(
          "Vous avez des modifications non sauvegardées. Voulez-vous continuer et perdre ces modifications?"
        );
        
        if (confirmUpload) {
          handleFileUploadInternal(file).then(resolve).catch(reject);
        } else {
          reject(new Error("Upload cancelled by user"));
        }
      });
    }
    
    return handleFileUploadInternal(file);
  };

  // Internal file upload function
  const handleFileUploadInternal = async (file) => {
    try {
      setLoading(true);
      toast({
        title: "Téléchargement en cours",
        description: "Traitement du fichier...",
        type: "info"
      });

      const response = await uploadExcelFile(file);
      await loadData(); // Reload data after successful upload
      
      toast({
        title: "Import réussi",
        description: `${response.processedRows} lignes ont été traitées avec succès`,
        type: "success",
        duration: 5000
      });
    } catch (error) {
      let errorMessage = "Impossible d'importer le fichier. ";
      
      if (error.message && error.message.includes("Missing required columns")) {
        errorMessage += error.message;
      } else if (error.message && error.message !== "Upload cancelled by user") {
        errorMessage += error.message;
      } else if (error.message === "Upload cancelled by user") {
        return; // Don't show error for user cancellation
      } else {
        errorMessage += "Veuillez vérifier le format du fichier.";
      }
      
      toast({
        title: "Erreur d'import",
        description: errorMessage,
        type: "error",
        duration: 7000
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Navigation functions
  const handleNavigate = (view, params = {}) => {
    setData(prevData => ({
      ...prevData,
      currentView: view,
      ...(params.axisId && { selectedAxis: params.axisId }),
      ...(params.domainId && { selectedDomain: params.domainId }),
      ...(params.objectiveId && { selectedObjective: params.objectiveId })
    }));
  };

  // Update objective in local state
  const updateObjective = (objectiveId, updates) => {
    setData(prevData => ({
      ...prevData,
      objectives: prevData.objectives.map(obj => 
        obj.id === objectiveId ? { ...obj, ...updates } : obj
      )
    }));
  };

  // Mark data as saved
  const markDataAsSaved = () => {
    setOriginalData({
      axes: data.axes,
      domains: data.domains,
      objectives: data.objectives
    });
    setHasUnsavedChanges(false);
    
    toast({
      title: "Modifications sauvegardées",
      description: "Toutes les modifications ont été enregistrées",
      type: "success"
    });
  };

  // Save new GCMM structure
  const saveNewGCMMStructure = async (structure) => {
    try {
      setLoading(true);
      
      // Transform the structure to match the expected format
      const newData = {
        axes: structure.axes.map(axis => ({
          ...axis,
          score: 0,
          scoreHistory: [],
          progress: 0
        })),
        domains: structure.axes.flatMap(axis => 
          axis.domains.map(domain => ({
            ...domain,
            axisId: axis.id,
            score: 0,
            scoreHistory: [],
            progress: 0
          }))
        ),
        objectives: structure.axes.flatMap(axis => 
          axis.domains.flatMap(domain => 
            domain.objectives.map(objective => ({
              ...objective,
              axisId: axis.id,
              domainId: domain.id,
              score: 0,
              scoreHistory: [],
              progress: 0,
              criteria: objective.criteria || []
            }))
          )
        ),
        loaded: true
      };

      // Update the context data
      setData(prevData => ({
        ...prevData,
        ...newData
      }));

      // Store as original data
      setOriginalData({
        axes: newData.axes,
        domains: newData.domains,
        objectives: newData.objectives
      });

      setHasUnsavedChanges(false);
      setGlobalScore(0);

      toast({
        title: "Structure créée",
        description: "La nouvelle structure GCMM a été créée avec succès",
        type: "success"
      });

      return true;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la structure GCMM. Veuillez réessayer.",
        type: "error"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        ...data,
        globalScore,
        loading,
        hasUnsavedChanges,
        loadData,
        handleFileUpload,
        saveNewGCMMStructure
      }}
    >
      {children}
    </DataContext.Provider>
  );
};