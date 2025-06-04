import React, { useContext } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';
import { DataContext } from '../context/DataContext';

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
            tick={{ fill: '#475569', fontSize: 14 }} 
            tickLine={false}
          />
          <PolarRadiusAxis 
            domain={[0, 5]}
            angle={90} 
            tick={{ fill: '#475569', fontSize: 10 }}
            axisLine={{ strokeWidth: 0.5 }}
            tickLine={{ size: 3 }}
            tickCount={6}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#3366CC"
            fill="#3366CC"
            fillOpacity={0.6}
            animationDuration={1000}
            animationEasing="ease-in-out"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AxisRadarChart;