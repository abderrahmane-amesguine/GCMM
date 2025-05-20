import React, { useContext } from 'react';
import { ArrowRightCircle, Shield, BarChart2, PieChart } from 'lucide-react';
import AxisRadarChart from '../charts/AxisRadarChart';
import ScoreBarChart from '../charts/ScoreBarChart';
import ScoreIndicator from '../components/ScoreIndicator';
import { DataContext } from '../context/DataContext';
import { getScoreBadgeClass } from '../utils/colors';

const Dashboard = () => {
  const context = useContext(DataContext) || {};
  const { axes = [], domains = [], objectives = [], globalScore = 0, handleNavigate = () => {} } = context;
  
  // Données pour le graphique à barres
  const barChartData = axes.map(axis => ({
    name: `Axe ${axis.id}`,
    score: axis.score,
    color: axis.color
  }));

  // Calculer quelques statistiques
  const totalObjectives = objectives.length;
  const avgScore = parseFloat(globalScore);
  const lowScoreObjectives = objectives.filter(obj => obj.evaluation < 2).length;
  const highScoreObjectives = objectives.filter(obj => obj.evaluation >= 4).length;

  return (
    <div className="flex flex-col space-y-8">
      {/* Hero section */}
      <div className="card bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold flex items-center">
              <Shield className="mr-2" /> Tableau de bord
            </h2>
            <p className="text-blue-100 mt-1">Aperçu de la maturité cybersécurité</p>
          </div>
          <ScoreIndicator score={globalScore} size="lg" showLabel={true} className="shadow-lg" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <div className="text-sm text-blue-100">Axes</div>
            <div className="text-2xl font-bold mt-1">{axes.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <div className="text-sm text-blue-100">Domaines</div>
            <div className="text-2xl font-bold mt-1">{domains.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <div className="text-sm text-blue-100">Objectifs</div>
            <div className="text-2xl font-bold mt-1">{totalObjectives}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <div className="text-sm text-blue-100">Objectifs à améliorer</div>
            <div className="text-2xl font-bold mt-1">{lowScoreObjectives}</div>
          </div>
        </div>
      </div>
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card transition-all transform hover:shadow-xl hover:-translate-y-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-blue-600" /> 
              Radar des axes
            </h3>
          </div>
          <div className="h-80">
            <AxisRadarChart />
          </div>
        </div>
        
        <div className="card transition-all transform hover:shadow-xl hover:-translate-y-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <BarChart2 className="w-5 h-5 mr-2 text-blue-600" /> 
              Scores par axe
            </h3>
          </div>
          <div className="h-80">
            <ScoreBarChart data={barChartData} />
          </div>
        </div>
      </div>
      
      {/* Axis cards */}
      <h3 className="text-xl font-semibold text-gray-800 mt-4">Axes d'évaluation</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {axes.map((axis) => {
          // Get badge class for this axis
          const badgeClass = getScoreBadgeClass(axis.score);
          
          return (
            <div 
              key={axis.id}
              className="card group cursor-pointer border-t-4 hover:shadow-2xl transform transition-all hover:-translate-y-1"
              onClick={() => handleNavigate('axis', axis.id)}
              style={{ borderTopColor: axis.color }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-blue-700">
                  <span className="inline-flex items-center justify-center w-6 h-6 mr-2 rounded-full text-sm" 
                       style={{backgroundColor: axis.color, color: 'white'}}>{axis.id}</span>
                  {axis.name}
                </h3>
                <div className={`${badgeClass.replace('bg-', 'bg-opacity-80 bg-')} text-center font-bold rounded-lg px-3 py-1`}>
                  {axis.score.toFixed(1)}
                </div>
              </div>
              
              <div className="relative mt-4 mb-6">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${(axis.score / 5) * 100}%`, backgroundColor: axis.color }}
                  ></div>
                </div>
                <div className="absolute -top-6 right-0 text-xs text-gray-500">5</div>
                <div className="absolute -top-6 left-0 text-xs text-gray-500">0</div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex gap-4">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                    {domains.filter(d => d.axisId === axis.id).length} domaines
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 mr-1"></span>
                    {objectives.filter(o => o.axisId === axis.id).length} objectifs
                  </span>
                </div>
                <ArrowRightCircle 
                  className="text-gray-400 group-hover:text-blue-600 transition-all" 
                  size={18} 
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Key highlights */}
      <div className="card bg-gradient-to-br from-gray-50 to-blue-50 border border-blue-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Points clés à améliorer</h3>
        <div className="space-y-4">
          {objectives
            .filter(obj => obj.evaluation < 2)
            .slice(0, 3)
            .map(obj => {
              const domain = domains.find(d => d.id === obj.domainId && d.axisId === obj.axisId);
              const axis = axes.find(a => a.id === obj.axisId);
              
              return (
                <div 
                  key={`${obj.axisId}-${obj.domainId}-${obj.id}`}
                  className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleNavigate('objective', obj.axisId, obj.domainId, obj.id)}
                >
                  <div className="flex items-start">
                    <div className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: axis.color }}>
                      <span className="text-white text-xs font-bold">{obj.axisId}.{obj.id}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{obj.name}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{obj.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{domain?.name}</span>
                        <ScoreIndicator score={obj.evaluation} size="sm" />
                      </div>
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

export default Dashboard;