import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';
import { Shield, BarChart2, PieChart, FileText, ArrowRight } from 'lucide-react';
import { axisColors } from '../utils/colors';
import ScoreIndicator from '../components/ScoreIndicator';

// Custom tooltip for the radar chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200 text-sm">
        <p className="font-semibold text-gray-800">{data.axis}</p>
        <p className="text-blue-600 font-medium mt-1">Score: {data.value.toFixed(2)}/5</p>
        <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
          <div 
            className="h-1.5 rounded-full" 
            style={{ width: `${(data.value / 5) * 100}%`, backgroundColor: data.color }}
          ></div>
        </div>
      </div>
    );
  }
  return null;
};

const GCMMDashboard = () => {
  const [data, setData] = useState({
    globalScore: 2.6,
    axes: [
      { id: 1, name: 'Legal', score: 2.8, color: axisColors[0] },
      { id: 2, name: 'Technologies', score: 3.2, color: axisColors[1] },
      { id: 3, name: 'Organization', score: 2.5, color: axisColors[2] },
      { id: 4, name: 'Capacity', score: 2.4, color: axisColors[3] },
      { id: 5, name: 'Cooperation', score: 2.1, color: axisColors[4] }
    ],
    domains: [
      { id: '3.1', name: 'Strategy', axisId: 3, score: 2.7 },
      { id: '3.2', name: 'Committees', axisId: 3, score: 2.3 },
      { id: '3.3', name: 'Cert/Csirt', axisId: 3, score: 2.8 },
      { id: '3.4', name: 'xxxx', axisId: 3, score: 2.4 },
      { id: '3.5', name: 'xxxx', axisId: 3, score: 2.2 },
      { id: '3.6', name: 'xxxx', axisId: 3, score: 2.6 }
    ],
    objectives: [
      { id: '3.2.63', name: 'xxxx', axisId: 3, domainId: '3.2', score: 2.1 },
      { id: '3.2.64', name: 'xxx', axisId: 3, domainId: '3.2', score: 2.3 },
      { id: '3.2.65', name: 'Exec Committee', axisId: 3, domainId: '3.2', score: 2.5 },
      { id: '3.2.66', name: 'xxx', axisId: 3, domainId: '3.2', score: 2.0 },
      { id: '3.2.67', name: 'xxxx', axisId: 3, domainId: '3.2', score: 2.6 }
    ]
  });

  // Prepare data for the radar chart
  const radarData = data.axes.map(axis => ({
    axis: `Axe ${axis.id}: ${axis.name}`,
    value: axis.score,
    fullMark: 5,
    color: axis.color
  }));

  // Prepare mini radar data for each axis
  const getAxisDomainData = (axisId) => {
    const axisDomains = data.domains.filter(d => d.axisId === axisId);
    return axisDomains.map(domain => ({
      domain: domain.name,
      value: domain.score,
      fullMark: 5
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500 flex items-center">
                <Shield className="mr-3" size={36} />
                GCMM Platform
              </h1>
              <p className="text-slate-500 mt-1">Global Cybersecurity Maturity Model</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
                <div>
                  <div className="text-xs uppercase font-semibold tracking-wider text-blue-700">Score Global</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-blue-700">{data.globalScore}</span>
                    <span className="text-sm font-medium text-blue-600 opacity-80">/5</span>
                  </div>
                </div>
                <div className="ml-4 h-14 w-14 relative">
                  <svg className="h-14 w-14 rotate-[-90deg]">
                    <circle
                      className="text-blue-200"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="transparent"
                      r="24"
                      cx="28"
                      cy="28"
                    />
                    <circle
                      className="text-blue-600"
                      strokeWidth="4"
                      strokeDasharray={2 * Math.PI * 24}
                      strokeDashoffset={2 * Math.PI * 24 * (1 - data.globalScore / 5)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="24"
                      cx="28"
                      cy="28"
                    />
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-sm font-bold text-blue-700">
                    {Math.round((data.globalScore / 5) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Global radar chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
              <PieChart className="w-5 h-5 mr-2 text-blue-600" /> 
              Vue globale - Radar des axes
            </h2>
            <div className="h-80">
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
                    dataKey="value"
                    stroke="#3366CC"
                    fill="#3366CC"
                    fillOpacity={0.6}
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Stats card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
              <BarChart2 className="w-5 h-5 mr-2 text-blue-600" /> 
              Vue d'ensemble
            </h2>
            <div className="space-y-5">
              <div>
                <div className="text-sm text-gray-500 mb-2">Score global</div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold text-blue-700">{data.globalScore}</div>
                  <ScoreIndicator score={data.globalScore} />
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-blue-600" 
                    style={{ width: `${(data.globalScore / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500 mb-3">Scores par axe</div>
                <div className="space-y-3">
                  {data.axes.map(axis => (
                    <div key={axis.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: axis.color }}
                        ></div>
                        <span className="text-sm font-medium">Axe {axis.id}: {axis.name}</span>
                      </div>
                      <div className="font-semibold">{axis.score.toFixed(1)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Axis panels */}
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Détail par axe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.axes.map(axis => (
            <div 
              key={axis.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 hover:shadow-lg transition-all"
              style={{ borderTopColor: axis.color }}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold" style={{ color: axis.color }}>
                    <span className="inline-flex items-center justify-center w-8 h-8 mr-2 rounded-lg text-white text-sm" 
                          style={{backgroundColor: axis.color}}>{axis.id}</span>
                    {axis.name}
                  </h3>
                  <ScoreIndicator score={axis.score} size="md" />
                </div>
                
                <div className="h-44 w-full mb-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius="70%" data={getAxisDomainData(axis.id)}>
                      <PolarGrid stroke="#e2e8f0" strokeDasharray="2 2" />
                      <PolarAngleAxis 
                        dataKey="domain" 
                        tick={{ fill: '#475569', fontSize: 10 }} 
                        tickLine={false}
                      />
                      <Radar
                        name="Score"
                        dataKey="value"
                        stroke={axis.color}
                        fill={axis.color}
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-sm">
                  <div className="text-gray-500">
                    {data.domains.filter(d => d.axisId === axis.id).length} domaines
                  </div>
                  <button className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    <span>Voir détails</span>
                    <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Featured domain */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-md">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="w-10 h-10 flex items-center justify-center rounded-full" style={{ backgroundColor: axisColors[2] }}>
                <span className="text-white font-bold">3</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-blue-800">Axe 3: Organisation</h2>
              <p className="text-blue-600">Focus sur les domaines et objectifs clés</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {data.domains.filter(d => d.axisId === 3).slice(0, 3).map(domain => (
              <div key={domain.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-800">{domain.id} {domain.name}</h3>
                  <ScoreIndicator score={domain.score} size="sm" />
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full" 
                    style={{ width: `${(domain.score / 5) * 100}%`, backgroundColor: axisColors[2] }}
                  ></div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  {data.objectives.filter(o => o.axisId === 3 && o.domainId === domain.id).length} objectifs
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GCMMDashboard;