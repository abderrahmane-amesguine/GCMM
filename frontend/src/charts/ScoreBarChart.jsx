import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine } from 'recharts';

// Custom tooltip component for the bar chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200 text-sm">
        <p className="font-semibold text-gray-800">{label}</p>
        <div className="flex items-center gap-2 mt-1">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: payload[0].payload.color }}
          ></div>
          <p className="text-gray-700">
            Score: <span className="font-medium">{payload[0].value.toFixed(2)}/5</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// Custom label for the bar
const renderCustomBarLabel = ({ x, y, width, value }) => {
  return (
    <text 
      x={x + width / 2} 
      y={y - 5} 
      fill="#4B5563" 
      textAnchor="middle" 
      fontSize={12}
      fontWeight={500}
    >
      {value.toFixed(1)}
    </text>
  );
};

const ScoreBarChart = ({ data }) => {
  // Calculate the average score to display a reference line
  const averageScore = data.reduce((sum, entry) => sum + entry.score, 0) / data.length;

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Aucune donnée disponible pour le graphique.</p>
      </div>
    );
  }
  
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 30, bottom: 20 }} 
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis 
            dataKey="name"
            tick={{ fill: '#475569', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            interval={0}
            width={100}
            height={60}
            angle={-45} // Rotate labels
            textAnchor="end" // Align rotated text
          />
          <YAxis 
            domain={[0, 5]} 
            tick={{ fill: '#475569', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickCount={6}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={averageScore} 
            stroke="#94A3B8" 
            strokeDasharray="3 3"
            label={{ 
              value: `Moyenne: ${averageScore.toFixed(2)}`, 
              fill: '#64748B',
              fontSize: 12,
              position: 'left',
              offset: 10
            }}
          />
          <Bar 
            dataKey="score" 
            name="Score" 
            radius={[4, 4, 0, 0]}
            label={renderCustomBarLabel}
            animationDuration={1500}
            animationEasing="ease-out"
            barSize={30} // Reduced bar size
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || '#3366CC'} 
                fillOpacity={0.8}
                stroke={entry.color || '#3366CC'}
                strokeWidth={1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreBarChart;