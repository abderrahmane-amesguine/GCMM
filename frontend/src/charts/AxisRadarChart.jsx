import React, { useContext } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';
import { DataContext } from '../context/DataContext';

// Custom tooltip component for the radar chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200 text-sm">
        <p className="font-semibold text-gray-800">{data.axis}</p>
        <p className="text-blue-600 font-medium mt-1">Score: {data.score.toFixed(2)}/5</p>
        <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
          <div 
            className="h-1.5 rounded-full" 
            style={{ width: `${(data.score / 5) * 100}%`, backgroundColor: data.color }}
          ></div>
        </div>
      </div>
    );
  }

  return null;
};

// Custom legend component for the radar chart
const CustomLegend = ({ payload }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center">
          <span 
            className="inline-block w-3 h-3 rounded-full mr-1"
            style={{ backgroundColor: entry.color }}
          ></span>
          <span className="text-sm text-gray-700">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const AxisRadarChart = () => {
  const context = useContext(DataContext) || {};
  const { radarData = [] } = context;

  if (!radarData.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Aucune donnée disponible pour le radar.</p>
      </div>
    );
  }
  
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius="75%" data={radarData}>
          <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <PolarAngleAxis 
            dataKey="axis" 
            tick={{ fill: '#475569', fontSize: 12 }} 
            tickLine={false}
          />
          <PolarRadiusAxis 
            domain={[0, 5]} 
            tick={{ fill: '#475569', fontSize: 10 }}
            axisLine={false}
            tickCount={6}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#3366CC"
            fill="#3366CC"
            fillOpacity={0.6}
            animationDuration={1000}
            animationEasing="ease-in-out"
          />
          <Legend content={<CustomLegend />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AxisRadarChart;