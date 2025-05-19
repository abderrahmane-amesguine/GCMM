import React, { useContext } from 'react';
import { ArrowLeft } from 'lucide-react';
import { DataContext } from '../context/DataContext';
import ScoreIndicator from '../components/ScoreIndicator';

const ObjectiveView = () => {
  const { axes, domains, objectives, selectedAxis, selectedDomain, selectedObjective, handleNavigate } = useContext(DataContext);
  
  const axis = axes.find(a => a.id === selectedAxis);
  if (!axis) return <div>Axe non trouvé</div>;
  
  const domain = domains.find(d => d.axisId === selectedAxis && d.id === selectedDomain);
  if (!domain) return <div>Domaine non trouvé</div>;
  
  const objective = objectives.find(
    o => o.axisId === selectedAxis && o.domainId === selectedDomain && o.id === selectedObjective
  );
  if (!objective) return <div>Objectif non trouvé</div>;
  
  const maturityLabels = ['Ad hoc', 'Initiated', 'Defined', 'Managed', 'Optimized'];
  
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => handleNavigate('domain', selectedAxis, selectedDomain)}
          className="mr-4 btn-secondary shadow-card"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="section-title" style={{ color: axis.color }}>
            Axe {axis.id}: {axis.name} / Domaine {domain.id}: {domain.name}
          </div>
          <h2 className="text-2xl font-bold mt-1 text-blue-700">
            Objectif {objective.id}: {objective.name}
          </h2>
        </div>
      </div>
      <div className="card">
        <h3 className="text-xl font-semibold mb-2">Description</h3>
        <p className="mb-4 text-gray-700">{objective.description}</p>
        <div className="flex items-center mt-6 mb-2">
          <h3 className="text-xl font-semibold mr-3">Évaluation actuelle: {objective.evaluation}/5</h3>
          <ScoreIndicator score={objective.evaluation} />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div 
            className="h-4 rounded-full" 
            style={{ width: `${(objective.evaluation / 5) * 100}%`, backgroundColor: axis.color }}
          ></div>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-4">Niveaux de maturité</h3>
        <div className="space-y-4">
          {objective.levels.map((level, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${objective.evaluation === index + 1 ? 'border-2 border-blue-500 shadow-card' : 'border-gray-200'} transition-base`}
              style={{ borderColor: objective.evaluation === index + 1 ? axis.color : '' }}
            >
              <h4 className="text-lg font-medium text-blue-700">{index + 1}. {maturityLabels[index]}</h4>
              <p className="text-gray-600 mt-1">{level}</p>
            </div>
          ))}
        </div>
        {objective.comment && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Commentaire</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-600">{objective.comment}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectiveView;