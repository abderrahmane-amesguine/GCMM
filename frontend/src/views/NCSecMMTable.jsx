import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import { saveObjectiveEvaluation } from '../services/api';
import { toast } from '../components/ui/Toast';

const NCSecMMTable = ({ onNavigate }) => {
  const { axes, domains, objectives, loading, refreshData } = useContext(DataContext);
  const [selectedAxis, setSelectedAxis] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [currentEvaluation, setCurrentEvaluation] = useState("");
  const [targetEvaluation, setTargetEvaluation] = useState("");
  const [currentComment, setCurrentComment] = useState("");

  const filteredDomains = domains.filter(domain => domain.axisId === selectedAxis);
  const filteredObjectives = objectives.filter(objective => {
    return objective.domainId === selectedDomain && objective.axisId === selectedAxis;
  });

  const handleAxisClick = (axisId) => {
    setSelectedAxis(axisId);
    setSelectedDomain(null);
    setSelectedObjective(null);
    setCurrentEvaluation("");
    setTargetEvaluation("");
    setCurrentComment("");
  };

  const handleDomainClick = (domainId) => {
    setSelectedDomain(domainId);
    setSelectedObjective(null);
    setCurrentEvaluation("");
    setTargetEvaluation("");
    setCurrentComment("");
  };

  const handleObjectiveClick = (objective) => {
    setSelectedObjective(objective);
    setCurrentEvaluation(objective.profile ? objective.profile.toString() : "");
    setTargetEvaluation(objective.target_profile ? objective.target_profile.toString() : "");
    setCurrentComment(objective.comment || "");
  };

  const handleSaveEvaluation = async () => {
    if (!selectedObjective) {
      toast({
        title: "Error",
        description: "No objective selected",
        type: "error"
      });
      return;
    }
    // Validation
    const curr = Number(currentEvaluation);
    const targ = Number(targetEvaluation);
    if (!curr || !targ || curr < 1 || curr > 5 || targ < curr || targ > 5) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid profile values (1-5, target >= current)",
        type: "error"
      });
      return;
    }
    try {
      await saveObjectiveEvaluation(
        selectedObjective.id,
        curr,
        targ,
        currentComment
      );
      if (refreshData) {
        await refreshData();
      }
      toast({
        title: "Success",
        description: "Evaluation saved successfully",
        type: "success"
      });
    } catch (error) {
      console.error("Error saving evaluation:", error);
      toast({
        title: "Error",
        description: error.message || "Error saving evaluation",
        type: "error"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main NCSecMM table with hierarchical selection */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Axes List */}
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg">
          <div className="bg-white p-4 font-semibold border-b border-gray-300">
            <h2 className="text-lg">Axes</h2>
          </div>
          <div className="bg-white">
            {axes.map(axis => (
              <div
                key={axis.id}
                onClick={() => handleAxisClick(axis.id)}
                className={`p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${selectedAxis === axis.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
              >
                <h3 className="font-medium">{axis.name}</h3>
                <p className="text-sm text-gray-600">Score: {axis.score.toFixed(2)}/5</p>
              </div>
            ))}
          </div>
        </div>
        {/* Domains List */}
        {selectedAxis && (
          <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg">
            <div className="bg-white p-4 font-semibold border-b border-gray-300">
              <h2 className="text-lg">Domains</h2>
            </div>
            <div className="bg-white">
              {filteredDomains.map(domain => (
                <div
                  key={domain.id}
                  onClick={() => handleDomainClick(domain.id)}
                  className={`p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${selectedDomain === domain.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                >
                  <h3 className="font-medium">{domain.name}</h3>
                  <p className="text-sm text-gray-600">Score: {domain.score.toFixed(2)}/5</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Objectives List */}
        {(selectedAxis && selectedDomain) && (
          <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg">
            <div className="bg-white p-4 font-semibold border-b border-gray-300">
              <h2 className="text-lg">Objectives</h2>
            </div>
            <div className="bg-white">
              {filteredObjectives.map(objective => (
                <div
                  key={objective.id}
                  onClick={() => handleObjectiveClick(objective)}
                  className={`p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${selectedObjective?.id === objective.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                >
                  <h3 className="font-medium">{objective.name}</h3>
                  <p className="text-sm text-gray-600">Level: {objective.profile}/5</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Selected Objective Details */}
      {selectedObjective && (
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg">
          <div className="bg-white p-4 font-semibold border-b border-gray-300">
            <h2 className="text-lg">Objective Details <span className='font-bold text-blue-600'>{selectedObjective.id}</span></h2>
          </div>
          <div className="bg-white p-4">
            <div className="grid grid-cols-12 gap-4 mb-6">
              <div className="col-span-2 font-semibold">ID:</div>
              <div className="col-span-10">{selectedObjective.id}</div>
              <div className="col-span-2 font-semibold">Axis:</div>
              <div className="col-span-10">{axes.find(a => a.id === selectedObjective.axisId)?.name}</div>
              <div className="col-span-2 font-semibold">Domain:</div>
              <div className="col-span-10">{domains.find(d => d.id === selectedObjective.domainId)?.name}</div>
              <div className="col-span-2 font-semibold">Objective:</div>
              <div className="col-span-10">{selectedObjective.name}</div>
              <div className="col-span-2 font-semibold">Description:</div>
              <div className="col-span-10">{selectedObjective.description}</div>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Maturity Levels</h3>
              <div className="grid grid-cols-5 gap-4">
                {selectedObjective.levels.map((level, index) => (
                  <div
                    key={index}
                    className={`px-4 pt-4 pb-2 rounded-lg border ${Number(currentEvaluation) >= index + 1
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                      }`}
                  >
                    <div className="font-medium mb-2">Level {index + 1}</div>
                    <p className="text-sm text-gray-600">{level.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold mb-4">Set Your Current Profile</h3>
              <div className="space-y-4">
                <div className='flex justify-between'>
                  <div className='w-1/2'>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Profil (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={currentEvaluation}
                      onChange={e => setCurrentEvaluation(e.target.value.replace(/[^0-9]/g, ''))}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-xs"
                    />
                  </div>
                  <div className='w-1/2'>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Profil ({currentEvaluation}-5)
                    </label>
                    <input
                      type="number"
                      min={currentEvaluation || 1}
                      max="5"
                      value={targetEvaluation}
                      onChange={e => setTargetEvaluation(e.target.value.replace(/[^0-9]/g, ''))}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-xs"
                    />
                  </div>
                  <div></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments
                  </label>
                  <textarea
                    value={currentComment}
                    onChange={e => setCurrentComment(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full h-32"
                    placeholder="Add your comments here..."
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveEvaluation}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save Profil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NCSecMMTable;