import React, { useContext } from 'react';
import { ArrowLeft, CheckSquare, AlertTriangle, ChevronRight, FileText, BarChart2 } from 'lucide-react';
import { DataContext } from '../context/DataContext';
import ScoreIndicator from '../components/ScoreIndicator';

const DomainView = () => {
  const { axes, domains, objectives, selectedAxis, selectedDomain, handleNavigate } = useContext(DataContext);
  
  const axis = axes.find(a => a.id === selectedAxis);
  if (!axis) return <div>Axe non trouvé</div>;
  
  const domain = domains.find(d => d.axisId === selectedAxis && d.id === selectedDomain);
  if (!domain) return <div>Domaine non trouvé</div>;
  
  const domainObjectives = objectives.filter(o => o.axisId === selectedAxis && o.domainId === selectedDomain);
  
  // Count objectives by evaluation score
  const lowScoreObjectives = domainObjectives.filter(o => o.evaluation < 2);
  const mediumScoreObjectives = domainObjectives.filter(o => o.evaluation >= 2 && o.evaluation < 4);
  const highScoreObjectives = domainObjectives.filter(o => o.evaluation >= 4);
  
  return (
    <div className="flex flex-col space-y-8">
      {/* Header with breadcrumb */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start">
            <button 
              onClick={() => handleNavigate('axis', selectedAxis)}
              className="mr-4 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all text-gray-600 mt-1"
              aria-label="Back to Axis"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <span 
                  className="inline-block w-3 h-3 rounded-full mr-1.5" 
                  style={{ backgroundColor: axis.color }}
                ></span>
                <span className="hover:text-blue-600 cursor-pointer" onClick={() => handleNavigate('axis', selectedAxis)}>
                  Axe {axis.id}: {axis.name}
                </span>
                <ChevronRight size={14} className="mx-1" />
                <span className="font-medium text-gray-700">Domaine {domain.id}</span>
              </div>
              <h2 className="text-2xl font-bold text-blue-700">
                {domain.name}
              </h2>
            </div>
          </div>
          
          <ScoreIndicator score={domain.score} size="lg" />
        </div>
        
        {/* Domain score progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Score du domaine</span>
            <span className="font-medium">{domain.score.toFixed(1)}/5</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-700" 
              style={{ width: `${(domain.score / 5) * 100}%`, backgroundColor: axis.color }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-md flex items-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
            <CheckSquare size={20} className="text-green-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Objectifs excellents</div>
            <div className="text-2xl font-bold text-green-600">{highScoreObjectives.length}</div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-md flex items-center">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
            <BarChart2 size={20} className="text-yellow-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Objectifs moyens</div>
            <div className="text-2xl font-bold text-yellow-600">{mediumScoreObjectives.length}</div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-md flex items-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Objectifs à améliorer</div>
            <div className="text-2xl font-bold text-red-600">{lowScoreObjectives.length}</div>
          </div>
        </div>
      </div>
      
      {/* Objectives list */}
      <div className="card bg-white rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <FileText size={20} className="mr-2 text-blue-500" />
          Objectifs ({domainObjectives.length})
        </h3>
        
        <div className="space-y-4">
          {domainObjectives.map((objective) => {
            // Determine border color based on evaluation
            let borderColor = "";
            if (objective.evaluation < 2) {
              borderColor = "border-red-300";
            } else if (objective.evaluation < 4) {
              borderColor = "border-yellow-300";
            } else {
              borderColor = "border-green-300";
            }
            
            return (
              <div 
                key={objective.id}
                className={`bg-white p-5 rounded-lg cursor-pointer hover:bg-blue-50 border-l-4 ${borderColor} shadow-sm transition-all hover:shadow-md group`}
                onClick={() => handleNavigate('objective', axis.id, domain.id, objective.id)}
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-medium text-blue-800 flex items-center gap-2">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-800">
                      {objective.id}
                    </span>
                    {objective.name}
                  </h4>
                  <ScoreIndicator score={objective.evaluation} size="md" />
                </div>
                
                <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                  {objective.description}
                </p>
                
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full transition-all" 
                    style={{ 
                      width: `${(objective.evaluation / 5) * 100}%`, 
                      backgroundColor: objective.evaluation < 2 ? '#EF4444' : 
                                        objective.evaluation < 4 ? '#F59E0B' : 
                                        '#10B981' 
                    }}
                  ></div>
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Niveau actuel: <span className="font-medium">{objective.evaluation}</span>
                  </div>
                  <div className="flex items-center text-blue-600 group-hover:translate-x-1 transition-transform">
                    <span className="text-sm font-medium mr-1">Voir détails</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DomainView;