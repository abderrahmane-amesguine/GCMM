import React, { useContext } from 'react';
import { ArrowLeft, BarChart2, Layers, Eye, Briefcase, Download, Printer } from 'lucide-react';
import DomainRadarChart from '../charts/DomainRadarChart';
import ScoreIndicator from '../components/ScoreIndicator';
import { DataContext } from '../context/DataContext';
import { axisColors } from '../utils/colors';

const AxisView = () => {
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
      { id: '3.2.63', name: 'xxxx', axisId: 3, domainId: '3.2', score: 2.1 },
      { id: '3.2.64', name: 'xxx', axisId: 3, domainId: '3.2', score: 2.3 },
      { id: '3.2.65', name: 'Exec Committee', axisId: 3, domainId: '3.2', score: 2.5 },
      { id: '3.2.66', name: 'xxx', axisId: 3, domainId: '3.2', score: 2.0 },
      { id: '3.2.67', name: 'xxxx', axisId: 3, domainId: '3.2', score: 2.6 }], selectedAxis = 2, handleNavigate = () => {} } = context;

  const axis = axes.find(a => a.id === selectedAxis);
  if (!axis) return <div>Axe non trouvé</div>;

  const axisDomains = domains.filter(d => d.axisId === selectedAxis);

  // Calculate some statistics
  const domainCount = axisDomains.length;
  const objectiveCount = objectives.filter(o => o.axisId === axis.id).length;
  const lowScoreObjectives = objectives.filter(o => o.axisId === axis.id && o.evaluation < 2).length;
  const highScoreObjectives = objectives.filter(o => o.axisId === axis.id && o.evaluation >= 4).length;

  return (
    <div className="flex flex-col space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center">
          <button
            onClick={() => handleNavigate('dashboard')}
            className="mr-4 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all text-gray-600"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-2xl font-bold flex items-center" style={{ color: axis.color }}>
              <span className="inline-flex items-center justify-center w-8 h-8 mr-2 rounded-lg text-white text-sm"
                style={{ backgroundColor: axis.color }}>{axis.id}</span>
              {axis.name}
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
            <Download size={16} />
            <span>Exporter</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
            <Printer size={16} />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* Score and statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart2 className="mr-2 text-blue-500" size={20} />
              Évaluation de l'axe
            </h3>

            <div className="flex items-center space-x-4 mb-6">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={axis.color}
                    strokeWidth="3"
                    strokeDasharray={`${axis.score * 20}, 100`}
                    strokeLinecap="round"
                  />
                  <text x="18" y="20.5" textAnchor="middle" fontSize="9" fontWeight="bold" fill={axis.color}>
                    {axis.score.toFixed(1)}
                  </text>
                </svg>
              </div>
              <div>
                <ScoreIndicator score={axis.score} size="lg" />
                <p className="text-sm text-gray-500 mt-1">sur 5 points</p>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{ width: `${(axis.score / 5) * 100}%`, backgroundColor: axis.color }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center text-gray-600 mb-2">
                  <Layers size={16} className="mr-2 text-blue-500" />
                  <span className="text-sm font-medium">Domaines</span>
                </div>
                <div className="text-2xl font-bold">{domainCount}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center text-gray-600 mb-2">
                  <Briefcase size={16} className="mr-2 text-indigo-500" />
                  <span className="text-sm font-medium">Objectifs</span>
                </div>
                <div className="text-2xl font-bold">{objectiveCount}</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Objectifs faibles:</span>
                <span className="font-medium text-red-600">{lowScoreObjectives}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Objectifs excellents:</span>
                <span className="font-medium text-green-600">{highScoreObjectives}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
              </svg>
              Performance par domaine
            </h3>
            <DomainRadarChart domains={axisDomains} axisColor={axis.color} />
          </div>
        </div>
      </div>

      {/* Domains grid */}
      <div className="card bg-white rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Layers size={20} className="mr-2 text-blue-500" />
          Domaines ({axisDomains.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {axisDomains.map((domain) => {
            // Count objectives for this domain
            const domainObjectives = objectives.filter(o => o.axisId === axis.id && o.domainId === domain.id);

            return (
              <div
                key={domain.key}
                className="bg-white p-5 rounded-lg cursor-pointer hover:bg-blue-50 shadow-sm border border-gray-200 transition-all hover:shadow-md group"
                onClick={() => handleNavigate('domain', axis.id, domain.id)}
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-medium text-blue-800 flex items-center gap-2">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-800">
                      {domain.id}
                    </span>
                    {domain.name}
                  </h4>
                  <ScoreIndicator score={domain.score} size="sm" />
                </div>

                <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: `${(domain.score / 5) * 100}%`, backgroundColor: axis.color }}
                  ></div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {domainObjectives.length} objectifs
                  </div>
                  <div className="flex items-center text-blue-600 group-hover:translate-x-1 transition-transform">
                    <Eye size={16} className="mr-1" />
                    <span className="text-sm font-medium">Voir détails</span>
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

export default AxisView;