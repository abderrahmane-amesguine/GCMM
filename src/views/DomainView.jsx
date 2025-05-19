import React, { useContext } from 'react';
import { ArrowLeft } from 'lucide-react';
import { DataContext } from '../context/DataContext';

const DomainView = () => {
  const { axes, domains, objectives, selectedAxis, selectedDomain, handleNavigate } = useContext(DataContext);
  
  const axis = axes.find(a => a.id === selectedAxis);
  if (!axis) return <div>Axe non trouvé</div>;
  
  const domain = domains.find(d => d.axisId === selectedAxis && d.id === selectedDomain);
  if (!domain) return <div>Domaine non trouvé</div>;
  
  const domainObjectives = objectives.filter(o => o.axisId === selectedAxis && o.domainId === selectedDomain);
  
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => handleNavigate('axis', selectedAxis)}
          className="mr-4 btn-secondary shadow-card"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="section-title" style={{ color: axis.color }}>
            Axe {axis.id}: {axis.name}
          </h2>
          <h3 className="text-xl font-bold mt-1 text-blue-700">
            Domaine {domain.id}: {domain.name}
          </h3>
        </div>
      </div>
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Score du domaine: {domain.score.toFixed(1)}/5</h3>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div 
            className="h-4 rounded-full" 
            style={{ width: `${(domain.score / 5) * 100}%`, backgroundColor: axis.color }}
          ></div>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-4">Objectifs</h3>
        <div className="space-y-4">
          {domainObjectives.map((objective) => (
            <div 
              key={objective.id}
              className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-blue-100 border border-gray-200 transition-base"
              onClick={() => handleNavigate('objective', axis.id, domain.id, objective.id)}
            >
              <h4 className="text-lg font-medium text-blue-700">{objective.id}. {objective.name}</h4>
              <p className="text-gray-600 text-sm mt-1">{objective.description}</p>
              <div className="mt-3 flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ width: `${(objective.evaluation / 5) * 100}%`, backgroundColor: axis.color }}
                  ></div>
                </div>
                <span className="ml-2 font-medium">{objective.evaluation}/5</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DomainView;