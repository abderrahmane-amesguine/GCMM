import React, { useContext } from 'react';
import { ArrowLeft } from 'lucide-react';
import DomainRadarChart from '../charts/DomainRadarChart';
import { DataContext } from '../context/DataContext';

const AxisView = () => {
  const { axes, domains, objectives, selectedAxis, handleNavigate } = useContext(DataContext);
  
  const axis = axes.find(a => a.id === selectedAxis);
  if (!axis) return <div>Axe non trouvé</div>;
  
  const axisDomains = domains.filter(d => d.axisId === selectedAxis);
  
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => handleNavigate('dashboard')}
          className="mr-4 btn-secondary shadow-card"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="section-title" style={{ color: axis.color }}>
          Axe {axis.id}: {axis.name}
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Score de l'axe</h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl font-bold" style={{ color: axis.color }}>{axis.score.toFixed(1)}</div>
              <div className="text-xl text-gray-500">/5</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className="h-4 rounded-full" 
                style={{ width: `${(axis.score / 5) * 100}%`, backgroundColor: axis.color }}
              ></div>
            </div>
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-2">Statistiques</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-gray-500 text-sm">Domaines</div>
                  <div className="text-lg font-bold">{axisDomains.length}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-gray-500 text-sm">Objectifs</div>
                  <div className="text-lg font-bold">{objectives.filter(o => o.axisId === axis.id).length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Performance par domaine</h3>
            <DomainRadarChart domains={axisDomains} axisColor={axis.color} />
          </div>
        </div>
      </div>
      <div className="card">
        <h3 className="text-xl font-semibold mb-6">Domaines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {axisDomains.map((domain) => (
            <div 
              key={domain.key}
              className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-blue-100 border border-gray-200 transition-base"
              onClick={() => handleNavigate('domain', axis.id, domain.id)}
            >
              <h4 className="text-lg font-medium text-blue-700">{domain.id}. {domain.name}</h4>
              <div className="mt-2 flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ width: `${(domain.score / 5) * 100}%`, backgroundColor: axis.color }}
                  ></div>
                </div>
                <span className="ml-2 font-medium">{domain.score.toFixed(1)}</span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {objectives.filter(o => o.axisId === axis.id && o.domainId === domain.id).length} objectifs
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AxisView;