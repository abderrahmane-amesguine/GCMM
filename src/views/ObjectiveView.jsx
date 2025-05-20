import React, { useContext, useState } from 'react';
import { ArrowLeft, ChevronRight, MessageSquare, Edit, CheckSquare, Award, ArrowUp, ArrowDown, Info } from 'lucide-react';
import { DataContext } from '../context/DataContext';
import ScoreIndicator from '../components/ScoreIndicator';
import { axisColors } from '../utils/colors';

const ObjectiveView = () => {
  const context = useContext(DataContext) || {};  
  const { axes = [{ id: 1, name: 'Legal', score: 2.8, color: axisColors[0] },
  { id: 2, name: 'Technologies', score: 3.2, color: axisColors[1] },
  { id: 3, name: 'Organization', score: 2.5, color: axisColors[2] },
  { id: 4, name: 'Capacity', score: 2.4, color: axisColors[3] },
  { id: 5, name: 'Cooperation', score: 2.1, color: axisColors[4] }], domains = [{ id: '3.1', name: 'Strategy', axisId: 3, score: 2.7 },
    { id: '3.2', name: 'Committees', axisId: 3, score: 2.3 },
    { id: '3.3', name: 'Cert/Csirt', axisId: 3, score: 2.8 },
    { id: '3.4', name: 'xxxx', axisId: 3, score: 2.4 },
    { id: '3.5', name: 'xxxx', axisId: 3, score: 2.2 },
    { id: '3.6', name: 'xxxx', axisId: 3, score: 2.6 }], objectives = [
      { id: '3.2.63', name: 'xxxx', axisId: 3, domainId: '3.2', score: 2.1, levels: ['Ad hoc', 'Initiated', 'Defined', 'Managed', 'Optimized'] },
      { id: '3.2.64', name: 'xxx', axisId: 3, domainId: '3.2', score: 2.3, levels: ['Ad hoc', 'Initiated', 'Defined', 'Managed', 'Optimized'] },
      { id: '3.2.65', name: 'Exec Committee', axisId: 3, domainId: '3.2', score: 2.5, levels: ['Ad hoc', 'Initiated', 'Defined', 'Managed', 'Optimized'] },
      { id: '3.2.66', name: 'xxx', axisId: 3, domainId: '3.2', score: 2.0 },
      { id: '3.2.67', name: 'xxxx', axisId: 3, domainId: '3.2', score: 2.6 }], selectedAxis = 3, selectedDomain = '3.2', selectedObjective = '3.2.65', handleNavigate = () => {} } = context;
  
  const [activeTab, setActiveTab] = useState('levels');
  
  const axis = axes.find(a => a.id === selectedAxis);
  if (!axis) return <div>Axe non trouvé</div>;
  
  const domain = domains.find(d => d.axisId === selectedAxis && d.id === selectedDomain);
  if (!domain) return <div>Domaine non trouvé</div>;
  
  const objective = objectives.find(
    o => o.axisId === selectedAxis && o.domainId === selectedDomain && o.id === selectedObjective
  );
  if (!objective) return <div>Objectif non trouvé</div>;
  
  const maturityLabels = ['Ad hoc', 'Initiated', 'Defined', 'Managed', 'Optimized'];
  
  // Next and previous objectives
  const domainObjectives = objectives.filter(o => o.axisId === selectedAxis && o.domainId === selectedDomain)
    .sort((a, b) => a.id - b.id);
  
  const currentIndex = domainObjectives.findIndex(o => o.id === selectedObjective);
  const prevObjective = currentIndex > 0 ? domainObjectives[currentIndex - 1] : null;
  const nextObjective = currentIndex < domainObjectives.length - 1 ? domainObjectives[currentIndex + 1] : null;
  
  // Tab switching function
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  return (
    <div className="flex flex-col space-y-8">
      {/* Header with breadcrumb */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-start">
            <button 
              onClick={() => handleNavigate('domain', selectedAxis, selectedDomain)}
              className="mr-4 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all text-gray-600 mt-1"
              aria-label="Back to Domain"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center flex-wrap text-sm text-gray-500 mb-1">
                <span 
                  className="inline-block w-3 h-3 rounded-full mr-1.5" 
                  style={{ backgroundColor: axis.color }}
                ></span>
                <span className="hover:text-blue-600 cursor-pointer" onClick={() => handleNavigate('axis', selectedAxis)}>
                  Axe {axis.id}: {axis.name}
                </span>
                <ChevronRight size={14} className="mx-1" />
                <span className="hover:text-blue-600 cursor-pointer" onClick={() => handleNavigate('domain', selectedAxis, selectedDomain)}>
                  Domaine {domain.id}: {domain.name}
                </span>
                <ChevronRight size={14} className="mx-1" />
                <span className="font-medium text-gray-700">Objectif {objective.id}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-blue-700">
                {objective.name}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <ScoreIndicator score={objective.evaluation} size="lg" />
            <button className="p-2 bg-blue-100 rounded-lg text-blue-600 hover:bg-blue-200 transition-colors">
              <Edit size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content with tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Tab navigation */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 text-sm font-medium flex items-center ${
              activeTab === 'levels' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
            }`}
            onClick={() => handleTabChange('levels')}
          >
            <Award size={16} className="mr-2" />
            Niveaux de maturité
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium flex items-center ${
              activeTab === 'description' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
            }`}
            onClick={() => handleTabChange('description')}
          >
            <Info size={16} className="mr-2" />
            Description
          </button>
          {objective.comment && (
            <button
              className={`px-6 py-3 text-sm font-medium flex items-center ${
                activeTab === 'comments' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={() => handleTabChange('comments')}
            >
              <MessageSquare size={16} className="mr-2" />
              Commentaires
            </button>
          )}
        </div>
        
        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'description' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Description détaillée</h3>
              <p className="text-gray-700 leading-relaxed">{objective.description}</p>
              
              <div className="mt-6 flex items-center">
                <div className="mr-2 text-sm text-gray-500">Évaluation actuelle:</div>
                <div className="text-lg font-bold">{objective.evaluation}/5</div>
                <ScoreIndicator score={objective.evaluation} className="ml-3" />
              </div>
              
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-700" 
                  style={{ width: `${(objective.evaluation / 5) * 100}%`, backgroundColor: axis.color }}
                ></div>
              </div>
            </div>
          )}
          
          {activeTab === 'levels' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Niveaux de maturité</h3>
                <div className="text-sm text-gray-500 flex items-center">
                  <span>Niveau actuel:</span>
                  <span className="ml-2 font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {objective.evaluation}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {objective.levels.map((level, index) => {
                  const levelNumber = index + 1;
                  const isCurrentLevel = levelNumber === objective.evaluation;
                  let levelClass = "border border-gray-200";
                  
                  if (isCurrentLevel) {
                    levelClass = "border-2 border-blue-500 shadow-lg";
                  } else if (levelNumber < objective.evaluation) {
                    levelClass = "border border-green-200 bg-green-50";
                  }
                  
                  return (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg transition-all ${levelClass} relative`}
                    >
                      {isCurrentLevel && (
                        <div className="absolute -right-1 -top-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                          <CheckSquare size={14} />
                        </div>
                      )}
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            isCurrentLevel 
                              ? 'bg-blue-500 text-white' 
                              : levelNumber < objective.evaluation
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            {levelNumber}
                          </div>
                        </div>
                        <div>
                          <h4 className={`text-base font-medium ${
                            isCurrentLevel ? 'text-blue-700' : 'text-gray-700'
                          }`}>
                            {levelNumber}. {maturityLabels[index]}
                          </h4>
                          <p className="text-gray-600 mt-1">{level}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {activeTab === 'comments' && objective.comment && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <MessageSquare size={18} className="mr-2 text-blue-500" />
                Commentaires
              </h3>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">A</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800">Auditeur</span>
                      <span className="text-xs text-gray-500">il y a 2 jours</span>
                    </div>
                    <p className="text-gray-600 mt-1">{objective.comment}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation between objectives */}
      <div className="flex justify-between">
        {prevObjective ? (
          <button
            onClick={() => handleNavigate('objective', selectedAxis, selectedDomain, prevObjective.id)}
            className="flex items-center px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span className="font-medium">Objectif précédent</span>
          </button>
        ) : (
          <div></div>
        )}
        
        {nextObjective && (
          <button
            onClick={() => handleNavigate('objective', selectedAxis, selectedDomain, nextObjective.id)}
            className="flex items-center px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium">Objectif suivant</span>
            <ArrowLeft size={16} className="ml-2 rotate-180" />
          </button>
        )}
      </div>
      
      {/* Recommended actions */}
      {objective.evaluation < 4 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
            <ArrowUp className="mr-2" />
            Recommandations pour améliorer
          </h3>
          <p className="text-blue-600 mb-4">
            Voici quelques actions recommandées pour atteindre le niveau suivant de maturité:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckSquare className="flex-shrink-0 mr-2 mt-0.5 text-blue-500" size={16} />
              <span>Examiner les exigences du niveau {objective.evaluation + 1}: <strong>{maturityLabels[objective.evaluation]}</strong></span>
            </li>
            <li className="flex items-start">
              <CheckSquare className="flex-shrink-0 mr-2 mt-0.5 text-blue-500" size={16} />
              <span>Documenter les processus actuels liés à cet objectif</span>
            </li>
            <li className="flex items-start">
              <CheckSquare className="flex-shrink-0 mr-2 mt-0.5 text-blue-500" size={16} />
              <span>Élaborer un plan d'action pour combler les lacunes identifiées</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ObjectiveView;