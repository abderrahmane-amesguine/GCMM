import { useContext } from 'react';
import { ArrowRightCircle, Shield, BarChart2, PieChart } from 'lucide-react';
import AxisRadarChart from '../charts/AxisRadarChart';
import ScoreBarChart from '../charts/ScoreBarChart';
import ScoreIndicator from '../components/ScoreIndicator';
import { DataContext } from '../context/DataContext';
import { getScoreBadgeClass } from '../utils/colors';

const Dashboard = ({ onNavigate }) => {
  const context = useContext(DataContext) || {};
  const { axes = [], domains = [], objectives = [], globalScore = 0 } = context;

  // Données pour le graphique à barres
  const barChartData = axes.map(axis => ({
    name: `Axe ${axis.id}`,
    score: axis.score,
    color: axis.color
  }));

  // Calculer quelques statistiques
  const totalObjectives = objectives.length;
  const lowScoreObjectives = objectives.filter(obj => obj.evaluation < 2).length;

  return (
    <div className="flex flex-col space-y-8 animate-fadeIn">
      {/* Hero section */}
      <div className="card bg-gradient-to-br from-blue-600 to-blue-800 text-white transform hover:scale-[1.01] transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold flex items-center">
              <Shield className="mr-2 animate-pulse" /> Tableau de bord
            </h2>
            <p className="text-blue-100 mt-1">Aperçu de la maturité cybersécurité</p>
          </div>
          <ScoreIndicator score={globalScore} size="lg" showLabel={true} className="shadow-lg hover:shadow-xl transition-shadow" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl transform hover:scale-105 transition-all duration-300">
            <div className="text-sm text-blue-100">Axes</div>
            <div className="text-2xl font-bold mt-1">{axes.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl transform hover:scale-105 transition-all duration-300">
            <div className="text-sm text-blue-100">Domaines</div>
            <div className="text-2xl font-bold mt-1">{domains.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl transform hover:scale-105 transition-all duration-300">
            <div className="text-sm text-blue-100">Objectifs</div>
            <div className="text-2xl font-bold mt-1">{totalObjectives}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl transform hover:scale-105 transition-all duration-300">
            <div className="text-sm text-blue-100">Objectifs à améliorer</div>
            <div className="text-2xl font-bold mt-1">{lowScoreObjectives}</div>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
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

        <div className="card transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
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
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mt-4">Axes d'évaluation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {axes.length > 0 ? axes.map((axis) => {
            // Get badge class for this axis
            const badgeClass = getScoreBadgeClass(axis.score);

            return (
              <div
                key={axis.id}
                className="card group cursor-pointer border-t-4 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2"
                onClick={() => onNavigate('axis', { axisId: axis.id })}
                style={{ borderTopColor: axis.color }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-blue-700">
                    <span className="inline-flex items-center justify-center w-6 h-6 mr-2 rounded-full text-sm transform group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: axis.color, color: 'white' }}>{axis.id}</span>
                    {axis.name}
                  </h3>
                  <div className={`${badgeClass.replace('bg-', 'bg-opacity-80 bg-')} text-center font-bold rounded-lg px-3 py-1 transform group-hover:scale-105 transition-transform`}>
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
                  <div className="absolute -top-4 right-0 text-xs text-gray-500 transition-opacity group-hover:opacity-100 opacity-0">5</div>
                  <div className="absolute -top-4 left-0 text-xs text-gray-500 transition-opacity group-hover:opacity-100 opacity-0">0</div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex gap-4">
                    <span className="flex items-center">
                      <ArrowRightCircle size={16} className="mr-1 group-hover:translate-x-1 transition-transform" />
                      Voir détails
                    </span>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              Aucun axe disponible
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;