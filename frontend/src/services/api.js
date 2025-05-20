import { axisColors } from '../utils/colors';

/**
 * API service for fetching GCMM data from the backend
 */
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Fetch all GCMM data from the backend
 * @returns {Promise<Object>} The complete GCMM data
 */
export const fetchGCMMData = async () => {
  const response = await fetch(`${API_BASE_URL}/data`);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  return response.json();
};

/**
 * Fetch all axes from the backend
 * @returns {Promise<Array>} List of axes
 */
export const fetchAxes = async () => {
  const response = await fetch(`${API_BASE_URL}/axes`);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  return response.json();
};

/**
 * Fetch domains for a specific axis
 * @param {number} axisId - The axis ID
 * @returns {Promise<Array>} List of domains for the axis
 */
export const fetchDomains = async (axisId) => {
  const response = await fetch(`${API_BASE_URL}/domains/${axisId}`);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  return response.json();
};

/**
 * Fetch objectives for a specific domain
 * @param {string} domainId - The domain ID
 * @returns {Promise<Array>} List of objectives for the domain
 */
export const fetchObjectives = async (domainId) => {
  const response = await fetch(`${API_BASE_URL}/objectives/${domainId}`);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  return response.json();
};

/**
 * Upload an Excel file to the backend
 * @param {File} file - The Excel file to upload
 * @returns {Promise<Object>} Upload response
 */
export const uploadExcelFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
      // Do not set Content-Type header, let the browser set it with the boundary
      headers: {
        // Add any required headers here
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || `Upload failed with status ${response.status}`;
      } catch {
        errorMessage = `Upload failed with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

/**
 * Save evaluation for an objective
 * @param {string} objectiveId - The ID of the objective
 * @param {number} evaluation - The evaluation score (1-5)
 * @param {string} comment - The evaluation comment
 * @returns {Promise<Object>} The updated objective
 */
export const saveObjectiveEvaluation = async (objectiveId, evaluation, comment) => {
  const response = await fetch(`${API_BASE_URL}/objectives/${objectiveId}/evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      objectiveId,
      evaluation: Number(evaluation),
      comment
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to save evaluation');
  }

  return response.json();
};

/**
 * Export GCMM data to an Excel file
 */
export const exportGCMMToExcel = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/export`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Export failed:', errorText);
      throw new Error(`Export failed: ${response.status} ${response.statusText}`);
    }
    
    // Check if we received the Excel file
    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('spreadsheet')) {
      console.error('Invalid content type:', contentType);
      throw new Error('Server did not return an Excel file');
    }
    
    // Get the filename from the Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition');
    const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
    const filename = filenameMatch ? filenameMatch[1] : 'GCMM_Export.xlsx';
    
    const blob = await response.blob();
    
    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, message: 'Export completed successfully' };
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
};

/**
 * Creates a sample data structure for testing without an API
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
      { id: '3.2.63', name: 'xxxx', axisId: 3, domainId: '3.2', score: 2.1, levels: ['Ad hoc', 'Initiated', 'Defined', 'Managed', 'Optimized'] },
      { id: '3.2.64', name: 'xxx', axisId: 3, domainId: '3.2', score: 2.3, levels: ['Ad hoc', 'Initiated', 'Defined', 'Managed', 'Optimized'] },
      { id: '3.2.65', name: 'Exec Committee', axisId: 3, domainId: '3.2', score: 2.5, levels: ['Ad hoc', 'Initiated', 'Defined', 'Managed', 'Optimized'] },
      { id: '3.2.66', name: 'xxx', axisId: 3, domainId: '3.2', score: 2.0, levels: ['Ad hoc', 'Initiated', 'Defined', 'Managed', 'Optimized'] },
      { id: '3.2.67', name: 'xxxx', axisId: 3, domainId: '3.2', score: 2.6, levels: ['Ad hoc', 'Initiated', 'Defined', 'Managed', 'Optimized'] }
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
  fetchGCMMData,
  fetchAxes,
  fetchDomains,
  fetchObjectives,
  uploadExcelFile,
  saveObjectiveEvaluation,
  exportGCMMToExcel,
  getSampleData
};