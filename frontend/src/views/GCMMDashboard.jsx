import React, { useContext } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';
import { Shield, BarChart2, PieChart, ArrowRight } from 'lucide-react';
import { DataContext } from '../context/DataContext';
import ScoreIndicator from '../components/ScoreIndicator';

// Custom tooltip for the radar chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const score = data.score || 0;
    
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200 text-sm">
        <p className="font-semibold text-gray-800">{data.axis}</p>
        <p className="text-blue-600 font-medium mt-1">Score: {score.toFixed(2)}/5</p>
        <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
          <div 
            className="h-1.5 rounded-full" 
            style={{ width: `${(score / 5) * 100}%`, backgroundColor: data.color }}
          ></div>
        </div>
      </div>
    );
  }
  return null;
};

const GCMMDashboard = () => {
  const { axes, domains, objectives, globalScore, radarData: contextRadarData } = useContext(DataContext);

  // Calculate statistics
  const totalObjectives = objectives.length;
  const lowScoreObjectives = objectives.filter(obj => obj.evaluation < 2).length;
  const highScoreObjectives = objectives.filter(obj => obj.evaluation >= 4).length;
  
  // Calculate improvement opportunities
  const improvementOpportunities = axes
    .map(axis => ({
      ...axis,
      objectives: objectives.filter(obj => obj.axisId === axis.id && obj.evaluation < 3)
    }))
    .filter(axis => axis.objectives.length > 0);

  // Calculate strengths
  const strengths = axes
    .map(axis => ({
      ...axis,
      objectives: objectives.filter(obj => obj.axisId === axis.id && obj.evaluation >= 4)
    }))
    .filter(axis => axis.objectives.length > 0);

  // Prepare radar chart data
  const radarData = axes.map(axis => ({
    axis: `Axe ${axis.id}: ${axis.name}`,
    score: axis.score || 0,
    fullMark: 5,
    color: axis.color
  }));

  return (
    <div className="space-y-8">
      {/* Hero section with global score */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              <Shield className="mr-3" />
              Cybersecurity Maturity Assessment
            </h1>
            <p className="text-blue-100 mt-2">
              Global maturity score based on {totalObjectives} objectives across {axes.length} axes
            </p>
          </div>
          <ScoreIndicator score={globalScore} size="xl" showLabel={true} className="shadow-lg px-2  py-1" />
        </div>

        {/* Statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-sm text-blue-100">Total Objectives</div>
            <div className="text-2xl font-bold mt-1">{totalObjectives}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-sm text-blue-100">Need Improvement</div>
            <div className="text-2xl font-bold mt-1">{lowScoreObjectives}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-sm text-blue-100">High Performance</div>
            <div className="text-2xl font-bold mt-1">{highScoreObjectives}</div>
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <BarChart2 className="mr-2" />
          Maturity by Axis
        </h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="axis" />
              <PolarRadiusAxis domain={[0, 5]} />
              <Tooltip content={<CustomTooltip />} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Improvement Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4 text-red-600 flex items-center">
            <PieChart className="mr-2" />
            Improvement Opportunities
          </h2>
          <div className="space-y-4">
            {improvementOpportunities.map(axis => (
              <div key={axis.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <h3 className="font-semibold" style={{ color: axis.color }}>
                  {axis.name}
                </h3>
                <ul className="mt-2 space-y-2">
                  {axis.objectives.slice(0, 3).map(obj => (
                    <li key={obj.id} className="flex items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">{obj.name}</p>
                        <ScoreIndicator score={obj.evaluation} size="sm" />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4 text-green-600 flex items-center">
            <Shield className="mr-2" />
            Key Strengths
          </h2>
          <div className="space-y-4">
            {strengths.map(axis => (
              <div key={axis.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <h3 className="font-semibold" style={{ color: axis.color }}>
                  {axis.name}
                </h3>
                <ul className="mt-2 space-y-2">
                  {axis.objectives.slice(0, 3).map(obj => (
                    <li key={obj.id} className="flex items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">{obj.name}</p>
                        <ScoreIndicator score={obj.evaluation} size="sm" />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GCMMDashboard;