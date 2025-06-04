import React, { useState, useRef, useCallback, useContext } from 'react';
import { X, UploadCloud, CheckCircle, File, Trash2 } from 'lucide-react';
import { toast } from './ui/Toast';
import { DataContext } from '../context/DataContext';
import ConfirmationDialog from './ConfirmationDialog';
import { useTranslation } from 'react-i18next';

const FileUploadModal = ({ isOpen, onClose, onFileUpload }) => {
  const { t } = useTranslation();
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
        title: t('fileUpload.invalidFileType'),
        description: t('fileUpload.invalidFileTypeMessage'),
        type: "error"
      });
      return false;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: t('fileUpload.fileTooLarge'),
        description: t('fileUpload.fileTooLargeMessage'),
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
        title: t('fileUpload.fileSelected'),
        description: t('fileUpload.fileReadyToUpload'),
        type: "info"
      });
    }
  };

  // Handle file submission with confirmation if needed
  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: t('fileUpload.noFileSelected'),
        description: t('fileUpload.noFileSelectedMessage'),
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
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">{t('common.cancel')}</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {t('fileUpload.title')}
              </h3>
              <div className="mt-4">
                <div 
                  className={`max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                    dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-1 text-center">
                    {!file ? (
                      <>
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>{t('fileUpload.dragDropText')}</span>
                            <input
                              ref={fileInputRef}
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                              accept=".xlsx,.xls,.csv"
                            />
                          </label>
                          <p className="pl-1">{t('fileUpload.browseFiles')}</p>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <File className="h-6 w-6 text-indigo-600" />
                        <span className="text-sm text-gray-900">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="text-sm text-red-600 hover:text-red-500"
                        >
                          <Trash2 className="h-5 w-5" aria-label={t('fileUpload.removeFile')} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {t('common.upload')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      </div>
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={async () => {
          await processFileUpload(pendingFileRef.current);
          setShowConfirmation(false);
        }}
        title={t('confirmDialog.warning.title')}
        message={t('confirmDialog.warning.message')}
        type="warning"
      />
    </div>
  );
};

export default FileUploadModal;