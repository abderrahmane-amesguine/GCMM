import React from 'react';
import { X, UploadCloud } from 'lucide-react';

const FileUploadModal = ({ isOpen, onClose, onFileUpload }) => {
  if (!isOpen) return null;
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Importer un fichier</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center">
          <UploadCloud className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500 mb-2">Cliquez pour parcourir ou glissez-déposez</p>
          <p className="text-gray-400 text-sm">Fichiers Excel (.xlsx, .xls)</p>
          <input 
            type="file" 
            className="hidden" 
            id="fileUpload" 
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
          />
          <button 
            onClick={() => document.getElementById('fileUpload').click()}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            Parcourir
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;