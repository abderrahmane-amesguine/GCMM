import React, { useContext } from 'react';
import AxisRadarChart from '../charts/AxisRadarChart';
import ScoreBarChart from '../charts/ScoreBarChart';
import ScoreIndicator from '../components/ScoreIndicator';
import { DataContext } from '../context/DataContext';

const Dashboard = () => {
  const { axes, domains, objectives, globalScore, handleNavigate } = useContext(DataContext);
  
  // Données pour le graphique à barres
  const barChartData = axes.map(axis => ({
    name: `Axe ${axis.id}`,
    score: axis.score,
    color: axis.color
  }));

  return (
    <div className="flex flex-col space-y-8">
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="section-title">Score Global: {globalScore}/5</h2>
          <ScoreIndicator score={globalScore} />
        </div>
        <AxisRadarChart />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {axes.map((axis) => (
          <div 
            key={axis.id}
            className="card cursor-pointer border-l-4 hover:shadow-2xl transition-base"
            onClick={() => handleNavigate('axis', axis.id)}
            style={{ borderLeft: `4px solid ${axis.color}` }}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-blue-700">{axis.id}. {axis.name}</h3>
              <span className="text-lg font-bold">{axis.score.toFixed(1)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full" 
                style={{ width: `${(axis.score / 5) * 100}%`, backgroundColor: axis.color }}
              ></div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500 gap-2">
              <span>{domains.filter(d => d.axisId === axis.id).length} domaines</span>
              <span className="mx-2 text-gray-300">|</span>
              <span>{objectives.filter(o => o.axisId === axis.id).length} objectifs</span>
            </div>
          </div>
        ))}
      </div>
      <div className="card mt-8">
        <h2 className="section-title mb-6">Répartition des évaluations</h2>
        <ScoreBarChart data={barChartData} />
      </div>
    </div>
  );
};

export default Dashboard;