import React, { useRef, useState } from "react";
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Shield, FileText, Users, BarChart3, ArrowRight, CheckCircle, Download, BookOpen, X, Globe } from "lucide-react"
import { useTranslation } from 'react-i18next';

function WelcomeScreen({ onFileUpload, onDownloadTemplate, onNavigate }) {
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef();
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);

  // Trigger file input dialog
  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  // Navigation for evaluation
  const handleStartEvaluation = () => {
    onNavigate("NCSecMM-builder");
  };

  // Template download handler
  const handleTemplateDownload = () => {
    onDownloadTemplate();
  };

  // Learn more modal handlers
  const openLearnMore = () => setIsLearnMoreOpen(true);
  const closeLearnMore = () => setIsLearnMoreOpen(false);

  const LearnMoreModal = () => {
    if (!isLearnMoreOpen) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={closeLearnMore}></div>

          {/* Modal panel */}
          <div className="relative inline-block w-full max-w-2xl p-6 my-8 bg-white rounded-lg shadow-xl transform transition-all">
            {/* Close button */}
            <button
              onClick={closeLearnMore}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-blue-600"
            >
              <X size={20} />
            </button>

            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <BookOpen className="mr-2 h-6 w-6 text-blue-600" />
                {t('welcomeScreen.gettingStartedGuide')}
              </h3>

              <div className="prose prose-blue max-w-none">
                <section className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">{t('welcomeScreen.whatIsNCSec')}</h4>
                  <p className="text-gray-600 mb-4">
                    {t('welcomeScreen.ncssecDescription')}
                  </p>
                </section>

                <section className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">{t('welcomeScreen.keyFeatures')}</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      {t('welcomeScreen.comprehensiveAssessment')}
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      {t('welcomeScreen.collaborativeEvaluation')}
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      {t('welcomeScreen.detailedReports')}
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      {t('welcomeScreen.progressTracking')}
                    </li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">{t('welcomeScreen.gettingStartedTemplate')}</h4>
                  <p className="text-gray-600 mb-4">
                    {t('welcomeScreen.templateDescription')}
                  </p>
                  <ul className="space-y-2 text-gray-600 mb-4">
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                      {t('welcomeScreen.preConfiguredFramework')}
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                      {t('welcomeScreen.detailedInstructions')}
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                      {t('welcomeScreen.sampleData')}
                    </li>
                  </ul>
                  <Button onClick={handleTemplateDownload} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                    <Download className="mr-2 h-4 w-4" />
                    {t('welcomeScreen.downloadTemplate')}
                  </Button>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' }
  ];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Name */}
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">NCSec Platform</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
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
                        className={`block w-full text-left px-4 py-2 text-sm ${i18n.language === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                          } hover:bg-blue-50 hover:text-blue-700 transition-colors duration-300`}
                        role="menuitem"
                      >
                        {language.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                onClick={handleImportClick}
                variant="outline"
                className="text-md px-4 py-3 text-blue-600 hover:bg-blue-600 hover:text-white group transition-all"
              >
                {t('welcomeScreen.importFile')}
                <FileText className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
              <Button
                onClick={handleStartEvaluation}
                className="bg-blue-600 hover:bg-blue-700 text-md text-white px-4 py-3 group transition-all"
              >
                {t('welcomeScreen.startEvaluation')}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {t('welcomeScreen.streamlineYourAssessment')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t('welcomeScreen.evaluateTrackImprove')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleStartEvaluation}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg text-white px-8 py-3 group transition-all"
              >
                {t('welcomeScreen.startNewEvaluation')}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={handleImportClick}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 text-blue-600 hover:bg-blue-600 hover:text-white group transition-all"
              >
                {t('welcomeScreen.importExistingFile')}
                <FileText className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('welcomeScreen.whyChooseNCSec')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('welcomeScreen.platformBenefits')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('welcomeScreen.comprehensiveAssessment')}</h3>
              <p className="text-gray-600">
                {t('welcomeScreen.evaluateAcrossDomains')}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('welcomeScreen.teamCollaboration')}</h3>
              <p className="text-gray-600">
                {t('welcomeScreen.workTogether')}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('welcomeScreen.detailedReports')}</h3>
              <p className="text-gray-600">
                {t('welcomeScreen.progressTracking')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Guide */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('welcomeScreen.howItWorks.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('welcomeScreen.howItWorks.description')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-10 h-8 flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('welcomeScreen.howItWorks.step1.title')}</h3>
                  <p className="text-gray-600">{t('welcomeScreen.howItWorks.step1.description')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-10 h-8 flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('welcomeScreen.howItWorks.step2.title')}</h3>
                  <p className="text-gray-600">{t('welcomeScreen.howItWorks.step2.description')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-10 h-8 flex items-center justify-center font-semibold text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('welcomeScreen.howItWorks.step3.title')}</h3>
                  <p className="text-gray-600">{t('welcomeScreen.howItWorks.step3.description')}</p>
                </div>
              </div>
            </div>

            <Card className="lg:ml-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  {t('welcomeScreen.howItWorks.getStarted.title')}
                </CardTitle>
                <CardDescription>
                  {t('welcomeScreen.howItWorks.getStarted.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleImportClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white group transition-all"
                  size="lg"
                >
                  <FileText className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  {t('welcomeScreen.howItWorks.getStarted.importButton')}
                </Button>
                <Button
                  onClick={handleStartEvaluation}
                  variant="outline"
                  className="w-full text-blue-600 hover:bg-blue-600 hover:text-white group transition-all"
                  size="lg"
                >
                  <Shield className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  {t('welcomeScreen.howItWorks.getStarted.startButton')}
                </Button>
                <p className="text-sm text-gray-500 text-center">
                  {t('welcomeScreen.howItWorks.getStarted.helpText')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('welcomeScreen.cta.title')}</h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('welcomeScreen.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleStartEvaluation}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3 group transition-all"
            >
              {t('welcomeScreen.cta.startButton')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={openLearnMore}
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3 group transition-all"
            >
              {t('welcomeScreen.cta.learnMore')}
              <BookOpen className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">{t('welcomeScreen.footer.platformName')}</span>
          </div>
          <p className="text-gray-400">
            {t('welcomeScreen.footer.copyright')}
          </p>
        </div>
      </footer>

      {/* Learn More Modal */}
      <LearnMoreModal />
    </div>
  );
}

export default WelcomeScreen;
