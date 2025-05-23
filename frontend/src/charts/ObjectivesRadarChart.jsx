import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200 text-sm">
        <p className="font-medium text-gray-800">{payload[0].payload.name}</p>
        <div className="flex items-center mt-1 text-blue-600">
          <span className="font-medium">Score: {payload[0].value.toFixed(1)}/5</span>
        </div>
        <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
          <div 
            className="h-1.5 rounded-full transition-all duration-300" 
            style={{ 
              width: `${(payload[0].value / 5) * 100}%`,
              backgroundColor: payload[0].payload.color
            }}
          />
        </div>
      </div>
    );
  }
  return null;
};

const ObjectivesRadarChart = ({ objectives, axisColor }) => {
  // Transform objectives data for the radar chart
  const chartData = objectives.map(objective => ({
    name: objective.name,
    score: objective.profile || 0,
    fullMark: 5,
    color: axisColor
  }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart 
          data={chartData} 
          margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
        >
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fill: '#475569', fontSize: 11 }}
          />
          <PolarRadiusAxis
            domain={[0, 5]}
            axisLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Score"
            dataKey="score"
            stroke={axisColor}
            fill={axisColor}
            fillOpacity={0.3}
            animationDuration={800}
            animationEasing="ease-in-out"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ObjectivesRadarChart;
