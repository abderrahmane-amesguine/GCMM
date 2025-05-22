import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-200">
        <p className="text-sm font-medium">{payload[0].payload.name}</p>
        <p className="text-sm text-gray-600">Score: {payload[0].value.toFixed(1)}/5</p>
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
    fullMark: 5
  }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 20)}...` : value}
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
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ObjectivesRadarChart;