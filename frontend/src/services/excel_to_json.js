import * as XLSX from 'xlsx';
import { axisColors } from '../utils/colors';

/**
 * Loads and processes an Excel file to extract GCMM data
 * @param {File|Blob|ArrayBuffer} file - The Excel file to process
 * @returns {Promise<Object>} The extracted data in a structured format
 */
export const processExcelFile = async (file) => {
  try {
    // Convert file to ArrayBuffer
    let fileData;
    if (file instanceof Blob) {
      fileData = await file.arrayBuffer();
    } else if (file instanceof ArrayBuffer) {
      fileData = file;
    } else if (window.fs && typeof window.fs.readFile === 'function') {
      fileData = await window.fs.readFile(file);
    } else {
      throw new Error('Unsupported file format');
    }

    // Read the workbook
    const workbook = XLSX.read(fileData, {
      cellStyles: true,
      cellFormulas: true,
      cellDates: true,
      cellNF: true,
      sheetStubs: true
    });
    
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    // Skip the header row (first row)
    const rows = jsonData.slice(1);
    
    // Extract axes, domains, and objectives
    const axes = [];
    const domains = [];
    const objectives = [];
    
    rows.forEach(row => {
      if (!row[0]) return; // Skip empty rows
      
      const axisId = parseInt(row[0], 10);
      const axisName = row[1];
      const domainId = row[2] ? row[2].toString() : null;
      const domainName = row[3];
      const objectiveId = row[4] ? row[4].toString() : null;
      const objectiveName = row[5];
      const description = row[6];
      const level1 = {LevelName : '1_Ad hoc', LevelDescription: row[7]};
      const level2 = {LevelName : '2_Initiated', LevelDescription: row[8]};
      const level3 = {LevelName : '3_Defined', LevelDescription: row[9]};
      const level4 = {LevelName : '4_Managed', LevelDescription: row[10]};
      const level5 = {LevelName : '5_Optimized', LevelDescription: row[11]};
      const evaluation = row[12] ? parseFloat(row[12]) : 0;
      const comment = row[13] ? row[13].toString() : '';
      
      // Add axis if it doesn't exist
      if (axisId && !isNaN(axisId) && !axes.some(a => a.id === axisId)) {
        axes.push({
          id: axisId,
          name: axisName,
          score: 0, // Will calculate later
          color: axisColors[(axisId - 1) % axisColors.length]
        });
      }
      
      // Add domain if it exists and doesn't already exist in our array
      if (domainId && domainName) {
        const domainKey = `${axisId}-${domainId}`;
        if (!domains.some(d => d.key === domainKey)) {
          domains.push({
            key: domainKey,
            id: domainId,
            name: domainName,
            axisId: axisId,
            score: 0 // Will calculate later
          });
        }
      }
      
      // Add objective if it exists
      if (objectiveId && objectiveName) {
        objectives.push({
          id: objectiveId,
          name: objectiveName,
          description: description || '',
          domainId: domainId,
          axisId: axisId,
          levels: [
            level1,
            level2,
            level3,
            level4,
            level5
          ].map(level => ({
            name: level.LevelName,
            description: level.LevelDescription
          })),
          evaluation: evaluation,
          comment: comment || ''
        });
      }
    });
    
    // Calculate domain scores
    domains.forEach(domain => {
      const domainObjectives = objectives.filter(o => 
        o.axisId === domain.axisId && 
        o.domainId === domain.id
      );
      
      if (domainObjectives.length > 0) {
        domain.score = domainObjectives.reduce((sum, obj) => 
          sum + obj.evaluation, 0
        ) / domainObjectives.length;
      }
    });
    
    // Calculate axis scores
    axes.forEach(axis => {
      const axisObjectives = objectives.filter(o => o.axisId === axis.id);
      
      if (axisObjectives.length > 0) {
        axis.score = axisObjectives.reduce((sum, obj) => 
          sum + obj.evaluation, 0
        ) / axisObjectives.length;
      }
    });
    
    // Calculate global score
    const globalScore = axes.reduce((sum, axis) => 
      sum + axis.score, 0
    ) / (axes.length || 1);
    
    // Prepare radar chart data
    const radarData = axes.map(axis => ({
      axis: `Axe ${axis.id}: ${axis.name}`,
      score: axis.score,
      fullMark: 5,
      color: axis.color
    }));
    
    return {
      axes,
      domains,
      objectives,
      globalScore: parseFloat(globalScore.toFixed(1)),
      radarData,
      loaded: true
    };
  } catch (error) {
    console.error('Error processing Excel file:', error);
    throw error;
  }
};

/**
 * Loads a specific Excel file by name
 * @param {string} fileName - The name of the Excel file to load
 * @returns {Promise<Object>} The extracted data
 */
export const loadExcelFile = async (fileName) => {
    console.log('loaded excel file');
  try {
    if (window.fs && typeof window.fs.readFile === 'function') {
      const excelData = await window.fs.readFile(fileName);
      return processExcelFile(excelData);
    } else {
      throw new Error('File system API not available');
    }
  } catch (error) {
    console.error(`Error loading Excel file ${fileName}:`, error);
    throw error;
  }
};

/**
 * Creates a sample data structure for testing without an Excel file
 * @returns {Object} Sample GCMM data
 */
export const getSampleData = () => {
  return {
    globalScore: 2.6,
    axes: [
      { id: 1, name: 'Legal', score: 2.8, color: axisColors[0] },
      { id: 2, name: 'Technologies', score: 3.2, color: axisColors[1] },
      { id: 3, name: 'Organization', score: 2.5, color: axisColors[2] },
      { id: 4, name: 'Capacity', score: 2.4, color: axisColors[3] },
      { id: 5, name: 'Cooperation', score: 2.1, color: axisColors[4] }
    ],
    domains: [
      { id: '3.1', name: 'Strategy', axisId: 3, score: 2.7 },
      { id: '3.2', name: 'Committees', axisId: 3, score: 2.3 },
      { id: '3.3', name: 'Cert/Csirt', axisId: 3, score: 2.8 },
      { id: '3.4', name: 'xxxx', axisId: 3, score: 2.4 },
      { id: '3.5', name: 'xxxx', axisId: 3, score: 2.2 },
      { id: '3.6', name: 'xxxx', axisId: 3, score: 2.6 }
    ],
    objectives: [
      { id: '3.2.63', name: 'xxxx', axisId: 3, domainId: '3.2', score: 2.1, levels: [['Ad hoc',''],[ 'Initiated', ''],[ 'Defined', ''],[ 'Managed', ''],[ 'Optimized', '']] },
      { id: '3.2.64', name: 'xxx', axisId: 3, domainId: '3.2', score: 2.3, levels: [[ 'Ad hoc', ''],[ 'Initiated', ''],[ 'Defined', ''],[ 'Managed', ''],[ 'Optimized', '']] },
      { id: '3.2.65', name: 'Exec Committee', axisId: 3, domainId: '3.2', score: 2.5, levels: [[ 'Ad hoc', ''],[ 'Initiated', ''],[ 'Defined', ''],[ 'Managed', ''],[ 'Optimized', '']] },
      { id: '3.2.66', name: 'xxx', axisId: 3, domainId: '3.2', score: 2.0, levels: [[ 'Ad hoc', ''],[ 'Initiated', ''],[ 'Defined', ''],[ 'Managed', ''],[ 'Optimized', '']] },
      { id: '3.2.67', name: 'xxxx', axisId: 3, domainId: '3.2', score: 2.6, levels: [[ 'Ad hoc', ''],[ 'Initiated', ''],[ 'Defined', ''],[ 'Managed', ''],[ 'Optimized', '']] }
    ],
    radarData: [
      { axis: 'Axe 1: Legal', score: 2.8, fullMark: 5, color: axisColors[0] },
      { axis: 'Axe 2: Technologies', score: 3.2, fullMark: 5, color: axisColors[1] },
      { axis: 'Axe 3: Organization', score: 2.5, fullMark: 5, color: axisColors[2] },
      { axis: 'Axe 4: Capacity', score: 2.4, fullMark: 5, color: axisColors[3] },
      { axis: 'Axe 5: Cooperation', score: 2.1, fullMark: 5, color: axisColors[4] }
    ],
    loaded: true
  };
};

export default {
  processExcelFile,
  loadExcelFile,
  getSampleData
};