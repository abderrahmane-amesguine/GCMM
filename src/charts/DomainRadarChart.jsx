import React, { useContext } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

const DomainRadarChart = ({ domains, axisColor }) => {
  // Préparer les données pour le graphique radar des domaines
  const domainRadarData = domains.map(domain => ({
    name: `Domaine ${domain.id}`,
    score: domain.score,
    fullMark: 5
  }));
  
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius={90} data={domainRadarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis domain={[0, 5]} />
          <Tooltip />
          <Radar
            name="Score"
            dataKey="score"
            stroke={axisColor}
            fill={axisColor}
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DomainRadarChart;