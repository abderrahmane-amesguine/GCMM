import React, { createContext, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { axisColors } from '../utils/colors';

// Création du contexte
export const DataContext = createContext();

// Provider du contexte
export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    axes: [],
    domains: [],
    objectives: [],
    loaded: false,
    currentView: 'dashboard',
    selectedAxis: null,
    selectedDomain: null,
    selectedObjective: null
  });
  
  const [radarData, setRadarData] = useState([]);
  const [globalScore, setGlobalScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fileName, setFileName] = useState('Fichier TEST.xlsx');

  // Chargement des données depuis le fichier Excel
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let excelData;
        if (window.fs && typeof window.fs.readFile === 'function') {
          excelData = await window.fs.readFile(fileName);
        } else {
          alert('La lecture de fichiers Excel n\'est pas supportée dans ce navigateur.');
          setLoading(false);
          return;
        }
        const workbook = XLSX.read(excelData, {
          cellStyles: true,
          cellFormulas: true,
          cellDates: true,
          cellNF: true,
          sheetStubs: true
        });
        
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
        // Ignorer la première ligne (en-têtes)
        const rows = jsonData.slice(1);
        
        // Extraire les axes, domaines et objectifs
        const axes = [];
        const domains = [];
        const objectives = [];
        
        rows.forEach(row => {
          if (!row[0]) return; // Ignorer les lignes vides
          
          const axisId = row[0];
          const axisName = row[1];
          const domainId = row[2];
          const domainName = row[3];
          const objectiveId = row[4];
          const objectiveName = row[5];
          const description = row[6];
          const level1 = row[7];
          const level2 = row[8];
          const level3 = row[9];
          const level4 = row[10];
          const level5 = row[11];
          const evaluation = row[12] ? parseInt(row[12], 10) : 0;
          const comment = row[13];
          
          // Ajouter l'axe s'il n'existe pas déjà
          if (!axes.some(a => a.id === axisId)) {
            axes.push({
              id: axisId,
              name: axisName,
              score: 0,
              color: axisColors[(axisId - 1) % axisColors.length]
            });
          }
          
          // Ajouter le domaine s'il n'existe pas déjà
          const domainKey = `${axisId}-${domainId}`;
          if (!domains.some(d => d.key === domainKey)) {
            domains.push({
              key: domainKey,
              id: domainId,
              name: domainName,
              axisId: axisId,
              score: 0
            });
          }
          
          // Ajouter l'objectif
          objectives.push({
            id: objectiveId,
            name: objectiveName,
            description: description,
            domainId: domainId,
            axisId: axisId,
            levels: [level1, level2, level3, level4, level5],
            evaluation: evaluation,
            comment: comment
          });
        });
        
        // Calculer les scores pour les domaines
        domains.forEach(domain => {
          const domainObjectives = objectives.filter(o => o.axisId === domain.axisId && o.domainId === domain.id);
          if (domainObjectives.length > 0) {
            domain.score = domainObjectives.reduce((sum, obj) => sum + obj.evaluation, 0) / domainObjectives.length;
          }
        });
        
        // Calculer les scores pour les axes
        axes.forEach(axis => {
          const axisObjectives = objectives.filter(o => o.axisId === axis.id);
          if (axisObjectives.length > 0) {
            axis.score = axisObjectives.reduce((sum, obj) => sum + obj.evaluation, 0) / axisObjectives.length;
          }
        });
        
        // Calculer le score global
        const globalScore = axes.reduce((sum, axis) => sum + axis.score, 0) / axes.length;
        setGlobalScore(globalScore.toFixed(1));
        
        // Préparer les données pour le graphique radar
        const radarData = axes.map(axis => ({
          axis: `Axe ${axis.id}: ${axis.name}`,
          score: axis.score,
          fullMark: 5,
          color: axis.color
        }));
        
        setRadarData(radarData);
        setData({
          axes,
          domains,
          objectives,
          loaded: true,
          currentView: 'dashboard',
          selectedAxis: null,
          selectedDomain: null,
          selectedObjective: null
        });
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setLoading(false);
      }
    };
    
    loadData();
  }, [fileName]);

  // Navigation entre les différentes vues
  const handleNavigate = (view, axisId = null, domainId = null, objectiveId = null) => {
    setData({
      ...data,
      currentView: view,
      selectedAxis: axisId,
      selectedDomain: domainId,
      selectedObjective: objectiveId
    });
  };

  // Fonction pour changer le fichier source
  const changeFile = (newFileName) => {
    setFileName(newFileName);
  };

  // Exposer les données et fonctions via le contexte
  return (
    <DataContext.Provider
      value={{
        ...data,
        radarData,
        globalScore,
        loading,
        fileName,
        handleNavigate,
        changeFile
      }}
    >
      {children}
    </DataContext.Provider>
  );
};