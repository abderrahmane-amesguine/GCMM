import React, { createContext, useState, useEffect } from 'react';
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

  // Function to load data from API
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetchGCMMData();
      
      setData(prevData => ({
        ...prevData,
        axes: response.axes || [],
        domains: response.domains || [],
        objectives: response.objectives || [],
        radarData: response.radarData || [],
        loaded: true
      }));
      
      setGlobalScore(response.globalScore || 0);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data from the server. Please try again later.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data on initial render
  useEffect(() => {
    loadData();
  }, []);

  // Function to handle file upload
  const handleFileUpload = async (file) => {
    try {
      setLoading(true);
      const response = await uploadExcelFile(file);
      await loadData(); // Reload data after successful upload
      
      toast({
        title: "Success",
        description: `File uploaded and processed successfully. ${response.processedRows} rows processed.`,
        type: "success"
      });
    } catch (error) {
      let errorMessage = "Failed to upload file. ";
      
      // Get the detailed error message from the error object
      if (error.message && error.message.includes("Missing required columns")) {
        errorMessage += error.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += "Please try again.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        type: "error"
      });
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

  return (
    <DataContext.Provider
      value={{
        ...data,
        globalScore,
        loading,
        handleFileUpload,
        handleNavigate,
        refreshData: loadData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};