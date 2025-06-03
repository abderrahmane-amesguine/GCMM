import { axisColors } from '../utils/colors';

/**
 * API service for fetching GCMM data from the backend
 */
const API_BASE_URL = 'https://ncsec.vercel.app/api';

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
    throw error;
  }
};

/**
 * Save evaluation for an objective
 * @param {string} objectiveId - The ID of the objective
 * @param {number} profile - The evaluation score (1-5)
 * @param {number} target_profile - The evaluation score (1-5)
 * @param {string} comment - The evaluation comment
 * @returns {Promise<Object>} The updated objective
 */
export const saveObjectiveEvaluation = async (objectiveId, profile, target_profile, comment) => {
  const response = await fetch(`${API_BASE_URL}/objectives/${objectiveId}/evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      objectiveId,
      profile: Number(profile),
      target_profile: Number(target_profile),
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
      throw new Error(`Export failed: ${response.status} ${response.statusText}`);
    }
    
    // Check if we received the Excel file
    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('spreadsheet')) {
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
    throw error;
  }
};

/**
 * Export a specific axis data to Excel
 * @param {number} axisId - The ID of the axis to export
 */
export const exportAxisToExcel = async (axisId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/axes/${axisId}/export`);
    
    if (!response.ok) {
      throw new Error(`Export failed: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('spreadsheet')) {
      throw new Error('Server did not return an Excel file');
    }
    
    const contentDisposition = response.headers.get('Content-Disposition');
    const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
    const filename = filenameMatch ? filenameMatch[1] : `GCMM_Axis_${axisId}_Export.xlsx`;
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, message: 'Axis export completed successfully' };
  } catch (error) {
    throw error;
  }
};

/**
 * Generate a Word report for a specific axis
 * @param {number} axisId - The ID of the axis to generate a report for
 */
export const generateAxisReport = async (axisId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/axes/${axisId}/report`);
    
    if (!response.ok) {
      throw new Error(`Report generation failed: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('word')) {
      throw new Error('Server did not return a Word document');
    }
    
    const contentDisposition = response.headers.get('Content-Disposition');
    const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
    const filename = filenameMatch ? filenameMatch[1] : `GCMM_Axis_${axisId}_Report.docx`;
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, message: 'Report generated successfully' };
  } catch (error) {
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

/**
 * Download GCMM template Excel file
 */
export const downloadGCMMTemplate = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/template`);
    
    if (!response.ok) {
      throw new Error(`Template download failed: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('spreadsheet')) {
      throw new Error('Server did not return an Excel file');
    }
    
    const contentDisposition = response.headers.get('Content-Disposition');
    const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
    const filename = filenameMatch ? filenameMatch[1] : 'GCMM_Template.xlsx';
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, message: 'Template downloaded successfully' };
  } catch (error) {
    throw error;
  }
};

/**
 * Save GCMM data to the backend
 * @param {Object} data - The GCMM data to save
 * @returns {Promise<Object>} Save response
 */
export const saveGCMMData = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || `Save failed with status ${response.status}`;
      } catch {
        errorMessage = `Save failed with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    throw new Error(`Failed to save GCMM data: ${error.message}`);
  }
};

export default {
  fetchGCMMData,
  uploadExcelFile,
  saveObjectiveEvaluation,
  exportGCMMToExcel,
  exportAxisToExcel,
  generateAxisReport,
  getSampleData,
  downloadGCMMTemplate,
  saveGCMMData
};
