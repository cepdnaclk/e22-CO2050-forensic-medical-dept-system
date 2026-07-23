// src/components/shared/StepIndicator.jsx
import { Check } from 'lucide-react';

export default function StepIndicator({ steps, currentStep, onStepClick }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div key={idx} className="flex-1 flex items-center">
              <button
                type="button"
                onClick={() => onStepClick && onStepClick(stepNum)}
                className={`flex items-center gap-2 transition-colors ${
                  onStepClick ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                {/* Circle */}
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-semibold border-2 transition-all flex-shrink-0 ${
                    isCompleted
                      ? 'bg-green-600 border-green-600 text-white'
                      : isActive
                      ? 'bg-[#1e3a5f] border-[#1e3a5f] text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
                </div>
                {/* Label */}
                <span
                  className={`text-xs font-medium whitespace-nowrap hidden sm:inline ${
                    isActive ? 'text-[#1e3a5f]' : isCompleted ? 'text-green-700' : 'text-gray-400'
                  }`}
                >
                  {step}
                </span>
              </button>
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    isCompleted ? 'bg-green-400' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
