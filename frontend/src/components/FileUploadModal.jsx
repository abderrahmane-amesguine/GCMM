import React, { useState, useRef, useCallback, useContext } from 'react';
import { X, UploadCloud, CheckCircle, File, Trash2 } from 'lucide-react';
import { toast } from './ui/Toast';
import { DataContext } from '../context/DataContext';
import ConfirmationDialog from './ConfirmationDialog';

const FileUploadModal = ({ isOpen, onClose, onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fileInputRef = useRef(null);
  const { hasUnsavedChanges } = useContext(DataContext);
  const pendingFileRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const validateFile = (file) => {
    if (!file) return false;

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an Excel (.xlsx, .xls) or CSV file",
        type: "error"
      });
      return false;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "File size should be less than 5MB",
        type: "error"
      });
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      toast({
        title: "File Selected",
        description: "File is ready to be uploaded",
        type: "info"
      });
    }
  };
  
  // Handle file submission with confirmation if needed
  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload",
        type: "warning"
      });
      return;
    }

    if (hasUnsavedChanges) {
      pendingFileRef.current = file;
      setShowConfirmation(true);
    } else {
      await processFileUpload(file);
    }
  };

  // Process the actual file upload
  const processFileUpload = async (fileToUpload) => {
    try {
      await onFileUpload(fileToUpload);
      setFile(null);
      onClose();
      toast({
        title: "Success",
        description: "File uploaded successfully",
        type: "success"
      });
    } catch (error) {
      if (error.message !== "Upload cancelled by user") {
        toast({
          title: "Upload Failed",
          description: error.message || "Error uploading file",
          type: "error"
        });
      }
    }
  };

  // Confirmation dialog handlers
  const handleConfirmUpload = async () => {
    if (pendingFileRef.current) {
      await processFileUpload(pendingFileRef.current);
      pendingFileRef.current = null;
    }
  };

  const handleCancelUpload = () => {
    pendingFileRef.current = null;
    setShowConfirmation(false);
  };
  
  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Importer un fichier</h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Body */}
          <div className="px-6 py-5">
            {!file ? (
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <UploadCloud className="mx-auto mb-4 text-blue-500" size={48} />
                <p className="text-gray-700 font-medium mb-2">
                  Glissez-déposez votre fichier ici
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  ou cliquez pour parcourir vos fichiers
                </p>
                <div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded mr-2">
                    .xlsx
                  </span>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded">
                    .xls
                  </span>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef}
                  id="fileUpload" 
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Parcourir les fichiers
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <File size={20} className="text-blue-600" />
                  </div>
                  <div className="ml-3 flex-1 truncate">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <button 
                        onClick={clearFile}
                        className="ml-2 flex-shrink-0 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full w-full"></div>
                    </div>
                    <div className="flex items-center mt-1">
                      <CheckCircle size={14} className="text-green-500 mr-1.5" />
                      <span className="text-xs text-green-600">Prêt à importer</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              type="button"
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                file ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              onClick={handleSubmit}
              disabled={!file}
            >
              {hasUnsavedChanges ? "Continuer avec l'import" : "Importer"}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <ConfirmationDialog
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmUpload}
          onCancel={handleCancelUpload}
          title="Unsaved Changes"
          message="You have unsaved changes. Are you sure you want to upload the file?"
        />
      )}
    </div>
  );
};

export default FileUploadModal;