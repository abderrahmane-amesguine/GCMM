import React, { useState } from 'react';
import { Shield, Upload, FileSpreadsheet, CheckCircle, AlertCircle, ArrowRight, BookOpen, Users, Target } from 'lucide-react';
import FileUploadModal from '../components/FileUploadModal';

const WelcomeScreen = ({ onFileUpload, onDownloadTemplate }) => {
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      onFileUpload(file);
    }
  };

  const features = [
    {
      icon: <Target className="w-6 h-6 text-blue-600" />,
      title: "Évaluation Complète",
      description: "Analysez votre maturité cybersécurité sur 5 axes principaux"
    },
    {
      icon: <Users className="w-6 h-6 text-green-600" />,
      title: "Collaboration Efficace",
      description: "Travaillez en équipe pour améliorer votre posture de sécurité"
    },
    {
      icon: <BookOpen className="w-6 h-6 text-purple-600" />,
      title: "Rapports Détaillés",
      description: "Générez des rapports professionnels et des plans d'action"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Logo and Title */}
        <div className="text-center mb-10 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full shadow-lg mb-6">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            NCSec Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Global Cybersecurity Maturity Model - Évaluez et améliorez votre maturité en cybersécurité
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-slideIn">
          <div 
            className={`p-12 text-center transition-all duration-300 ${
              isDragging ? 'bg-blue-50 border-2 border-blue-400 border-dashed' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
                <FileSpreadsheet className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Commencez votre évaluation
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Importez votre fichier Excel NCSec pour démarrer l'analyse de votre maturité en cybersécurité
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setIsFileUploadOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-medium rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Upload className="mr-3" size={20} />
                Importer votre fichier NCSec
              </button>

              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <CheckCircle size={16} className="text-green-500" />
                <span>Formats acceptés: .xlsx, .xls</span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm text-amber-800 font-medium">
                    Nouveau sur la plateforme?
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    <button 
                      onClick={onDownloadTemplate}
                      className="underline hover:text-amber-800 transition-colors"
                    >
                      Téléchargez notre template Excel
                    </button> pour commencer votre évaluation
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-gray-50 px-12 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-sm mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Besoin d'aide? Consultez notre{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              guide d'utilisation
            </a>
          </p>
        </div>
      </div>

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={isFileUploadOpen}
        onClose={() => setIsFileUploadOpen(false)}
        onFileUpload={onFileUpload}
      />
    </div>
  );
};

export default WelcomeScreen;