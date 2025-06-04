import React, { useContext } from 'react';
import { Menu, Shield, AlertCircle, Info, Table, BarChart2, FileSpreadsheet, Globe } from 'lucide-react';
import { DataContext } from '../context/DataContext';
import { getScoreBadgeClass } from '../utils/colors';
import { exportNCSecMMToExcel } from '../services/api';
import { toast } from './ui/Toast';
import { useTranslation } from 'react-i18next';

const Header = ({ toggleSidebar, switchView, activeView }) => {
  const { t, i18n } = useTranslation();
  const context = useContext(DataContext) || {};
  const { globalScore = 0, loaded = false, axes = [], hasUnsavedChanges = false, markDataAsSaved } = context;

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' }
  ];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  const handleExport = async () => {
    try {
      await exportNCSecMMToExcel();
      toast({
        title: "Export réussi",
        description: "Le fichier NCSecMM a été exporté avec succès.",
        type: "success"
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Une erreur s'est produite lors de l'export du fichier.",
        type: "error"
      });
    }
  };

  // Format the score for display
  const displayScore = loaded ? parseFloat(globalScore).toFixed(1) : "0.0";
  const scorePercentage = loaded ? (parseFloat(globalScore) / 5) * 100 : 0;
  const badgeClass = getScoreBadgeClass(parseFloat(displayScore));

  return (
    <header className="bg-white/80 shadow-md backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="mr-4 p-2 rounded-lg hover:bg-blue-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 hover:rotate-180 duration-300"
              aria-label={t('tooltips.menu')}
            >
              <Menu size={24} className="text-blue-700 transform transition-transform" />
            </button>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">                  {t('header.title')}
                </h1>
                <p className="text-sm text-gray-500">{t('header.subtitle')}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative group">
              <button
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 transition-all duration-300"
                aria-label={t('header.language.select')}
              >
                <Globe size={16} className="text-gray-600" />
                <span className="text-gray-700">{languages.find(lang => lang.code === i18n.language)?.name}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="language-menu">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        i18n.language === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      } hover:bg-blue-50 hover:text-blue-700 transition-colors duration-300`}
                      role="menuitem"
                    >
                      {language.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-2">
              <button
                className={`px-3 py-1.5 text-sm flex items-center gap-1 rounded-lg transition-all duration-300 ${
                  activeView === 'NCSecMM-table' 
                    ? 'bg-blue-100 text-blue-700 font-medium shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => switchView('NCSecMM-table')}
              >
                <Table size={16} className="transition-transform group-hover:scale-110" />
                <span>{t('header.buttons.ncsecTable')}</span>
              </button>
              <button
                className={`px-3 py-1.5 text-sm flex items-center gap-1 rounded-lg transition-all duration-300 ${
                  activeView === 'NCSecMM' 
                    ? 'bg-blue-100 text-blue-700 font-medium shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => switchView('NCSecMM')}
              >
                <BarChart2 size={16} className="transition-transform group-hover:scale-110" />
                <span>{t('header.buttons.dashboard')}</span>
              </button>
            </div>

            {loaded && (
              <div className="group relative">
                <div className={`flex items-center gap-2 ${badgeClass} px-4 py-2 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl cursor-help transform hover:-translate-y-1`}>
                  <div>                    <div className="text-xs uppercase font-semibold tracking-wider">{t('header.score.title')}</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold">{displayScore}</span>
                      <span className="text-sm font-medium opacity-80">{t('header.score.outOf')}</span>
                    </div>
                  </div>
                  <div className="h-10 w-10 relative">
                    <svg className="h-10 w-10 rotate-[-90deg] transition-transform duration-700">
                      <circle
                        className="text-gray-300"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="transparent"
                        r="16"
                        cx="20"
                        cy="20"
                      />
                      <circle
                        className="text-current transition-all duration-700"
                        strokeWidth="4"
                        strokeDasharray={100.53}
                        strokeDashoffset={100.53 - scorePercentage / 100 * 100.53}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="16"
                        cx="20"
                        cy="20"
                      />
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-bold">
                      {Math.round(scorePercentage)}%
                    </div>
                  </div>
                </div>

                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <h3 className="font-semibold mb-2 flex items-center gap-1">
                    <Info size={14} /> {t('header.score.details')}
                  </h3>
                  <div className="space-y-2">
                    {loaded && axes.map(axis => (
                      <div key={axis.id} className="flex justify-between items-center group/item hover:bg-gray-50 p-1 rounded transition-colors">
                        <span className="text-sm flex items-center">
                          <span className="w-3 h-3 rounded-full mr-2 transition-transform group-hover/item:scale-110" style={{ backgroundColor: axis.color }}></span>
                          {axis.name}
                        </span>
                        <span className="font-medium group-hover/item:text-blue-600 transition-colors">{axis.score.toFixed(1)}/5</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-300 hover:shadow-md"
            >
              <FileSpreadsheet size={18} />
              <span className="font-medium">{t('header.buttons.export')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;