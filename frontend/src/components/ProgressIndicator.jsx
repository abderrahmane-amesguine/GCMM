import React from 'react';
import { CheckCircle } from 'lucide-react';

const ProgressIndicator = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center group">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                    transform group-hover:scale-110
                    ${isCompleted 
                      ? 'bg-green-500 text-white shadow-lg shadow-green-200' 
                      : isCurrent 
                        ? 'bg-blue-500 text-white animate-pulse shadow-lg shadow-blue-200' 
                        : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle size={20} className="animate-fadeIn" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-xs font-medium transition-colors duration-200 ${
                    isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">{step.description}</p>
                  )}
                </div>
              </div>
              {!isLast && (
                <div className="flex-1 mx-4">
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-700 ease-out"
                      style={{
                        width: isCompleted ? '100%' : '0%',
                        backgroundColor: isCompleted ? '#22c55e' : '#3b82f6'
                      }}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;