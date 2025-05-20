import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';

// Custom tooltip for domain radar chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200 text-sm">
        <p className="font-semibold text-gray-800">{data.name}</p>
        <p className="text-blue-600 font-medium mt-1">Score: {data.score.toFixed(2)}/5</p>
        <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
          <div 
            className="h-1.5 rounded-full bg-blue-600" 
            style={{ width: `${(data.score / 5) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return null;
};

const DomainRadarChart = ({ domains, axisColor }) => {
  // Prepare data for the radar chart
  const formattedData = domains.map(domain => ({
    name: `Domaine ${domain.id}`,
    score: domain.score,
    fullMark: 5
  }));
  
  // Generate lighter colors from the main axis color
  const generateLighterColor = (color, factor = 0.3) => {
    // Parse the hex color
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);
    
    // Lighten the color
    r = Math.min(255, r + (255 - r) * factor);
    g = Math.min(255, g + (255 - g) * factor);
    b = Math.min(255, b + (255 - b) * factor);
    
    // Convert back to hex
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  };
  
  const radarFillColor = axisColor ? generateLighterColor(axisColor) : '#3366CC';
  
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius="75%" data={formattedData}>
          <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <PolarAngleAxis 
            dataKey="name" 
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
            stroke={axisColor || '#3366CC'}
            fill={radarFillColor}
            fillOpacity={0.7}
            animationDuration={1000}
            animationEasing="ease-in-out"
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DomainRadarChart;