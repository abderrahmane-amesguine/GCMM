import React, { useContext } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { DataContext } from '../context/DataContext';

const AxisRadarChart = () => {
  const { radarData } = useContext(DataContext);
  
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius={90} data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="axis" />
          <PolarRadiusAxis domain={[0, 5]} />
          <Tooltip />
          {radarData.map((entry, index) => (
            <Radar
              key={index}
              name={entry.axis}
              dataKey="score"
              stroke={entry.color}
              fill={entry.color}
              fillOpacity={0.6}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AxisRadarChart;