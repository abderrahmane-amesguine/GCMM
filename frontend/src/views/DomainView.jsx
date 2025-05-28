import React, { useContext } from 'react';
import { ArrowLeft, BarChart2, Layers, Check, AlertTriangle, Activity } from 'lucide-react';
import ScoreIndicator from '../components/ScoreIndicator';
import { DataContext } from '../context/DataContext';
import ObjectivesRadarChart from '../charts/ObjectivesRadarChart';

const DomainView = ({ axisId, domainId, onNavigate }) => {
  const { axes, domains, objectives } = useContext(DataContext);

  // Get the current domain and its axis
  const domain = domains.find(d => d.id === domainId);
  const axis = axes.find(a => a.id === axisId);

  if (!domain || !axis) {
    return <div>Domain not found</div>;
  }

  // Get objectives for this domain
  const domainObjectives = objectives.filter(o => {
    return o.domainId === domain.id && o.axisId === axis.id;
  }).sort((a, b) => b.profile - a.profile);

  // Calculate statistics
  const objectiveCount = domainObjectives.length;
  const avgScore = domainObjectives.reduce((sum, objective) => sum + objective.profile, 0) / objectiveCount;
  const lowScoreObjectives = domainObjectives.filter(o => o.profile <= 2);
  const highScoreObjectives = domainObjectives.filter(o => o.profile >= 4);

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center">
          <button
            onClick={() => onNavigate('axis', { axisId })}
            className="mr-4 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all text-gray-600"
            aria-label="Back to Axis"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="text-sm text-gray-500 mb-1">
              {axis.name}
            </div>
            <h2 className="text-2xl font-bold">{domain.name}</h2>
          </div>
        </div>
        <ScoreIndicator score={domain.score} size="lg" showLabel={true} />
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center text-blue-600 mb-2">
            <Layers className="mr-2" size={20} />
            <h3 className="font-semibold">Objectives</h3>
          </div>
          <p className="text-3xl font-bold">{objectiveCount}</p>
          <p className="text-gray-500 text-sm mt-1">Total objectives in this domain</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center text-red-600 mb-2">
            <AlertTriangle className="mr-2" size={20} />
            <h3 className="font-semibold">Need Improvement</h3>
          </div>
          <p className="text-3xl font-bold">{lowScoreObjectives.length}</p>
          <p className="text-gray-500 text-sm mt-1">Objectives scoring below 2</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center text-green-600 mb-2">
            <Check className="mr-2" size={20} />
            <h3 className="font-semibold">High Performance</h3>
          </div>
          <p className="text-3xl font-bold">{highScoreObjectives.length}</p>
          <p className="text-gray-500 text-sm mt-1">Objectives scoring 4 or above</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          {
            avgScore >= 3 ? (
              <div className="flex items-center text-green-600 mb-2">
                <Check className="mr-2" size={20} />
                <h3 className="font-semibold">Score Moyenne</h3>
              </div>
            ) : (
              <div className="flex items-center text-red-600 mb-2">
                <AlertTriangle className="mr-2" size={20} />
                <h3 className="font-semibold">Score Moyenne</h3>
              </div>
            )
          }
          <p className="text-3xl font-bold">{avgScore.toFixed(2)}</p>
          <p className="text-gray-500 text-sm mt-1">Average score for this domain</p>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center">
            <Activity className="mr-2" />
            Objectives Performance
          </h3>
        </div>
        <div className="h-[400px]">
          <ObjectivesRadarChart objectives={domainObjectives} axisColor={axis.color} />
        </div>
      </div>

      {/* Objectives List */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold flex items-center">
            <BarChart2 className="mr-2" />
            Objectives
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {domainObjectives.map(objective => (
            <div
              key={objective.id}
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onNavigate('objective', {
                axisId: axis.id,
                domainId: domain.id,
                objectiveId: objective.id
              })}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{objective.name}</h4>
                  <p className="text-sm text-gray-500">{objective.description}</p>
                </div>
                <ScoreIndicator score={objective.profile} size="md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DomainView;