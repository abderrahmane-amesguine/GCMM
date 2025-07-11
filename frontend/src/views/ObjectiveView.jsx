import React, { useContext } from 'react';
import { ArrowLeft, Target, CheckCircle } from 'lucide-react';
import ScoreIndicator from '../components/ScoreIndicator';
import { DataContext } from '../context/DataContext';
import { useTranslation } from 'react-i18next';

const ObjectiveView = ({ axisId, domainId, objectiveId, onNavigate }) => {
  const { t } = useTranslation();
  const { axes, domains, objectives } = useContext(DataContext);

  // Get the current objective and its related data
  const objective = objectives.find(o => o.id === objectiveId);
  const domain = domains.find(d => d.id === domainId);
  const axis = axes.find(a => a.id === axisId);

  if (!objective || !domain || !axis) {
    return <div>{t('objectiveView.notFound')}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center">
          <button
            onClick={() => onNavigate('domain', { axisId: axis.id, domainId: domain.id })}
            className="mr-4 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all text-gray-600"
            aria-label={t('objectiveView.backToDomain')}
            style={{color: `${axis.color}`}}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="text-sm text-gray-500 mb-1">
              {axis.name}{t('objectiveView.navigation.separator')}{domain.name}
            </div>
            <h2 className="text-2xl font-bold" style={{color: `${axis.color}`}}>{objective.name}</h2>
          </div>        </div>
        <ScoreIndicator score={objective.profile} size="lg" showLabel={true} />
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold flex items-center mb-4" style={{color: `${axis.color}`}}>
          <Target className="mr-2" />
          {t('objectiveView.sections.description.title')}
        </h3>
        <p className="text-gray-600 whitespace-pre-wrap">{objective.description}</p>
      </div>

      {/* Maturity Levels */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold flex items-center mb-4" style={{color: `${axis.color}`}}>
          <CheckCircle className="mr-2" />
          {t('objectiveView.sections.maturityLevels.title')}
        </h3>
        <div className="space-y-6">
          {objective.levels.map((level, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${
                objective.profile >= index + 1 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  objective.profile >= index + 1
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Level {level.level}</h4>
                  <p className="text-gray-600">{level.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comments */}
      {objective.comment && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Comments</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{objective.comment}</p>
        </div>
      )}    </div>
  );
};

export default ObjectiveView;