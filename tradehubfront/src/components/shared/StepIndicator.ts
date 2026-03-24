/**
 * StepIndicator Component
 * Horizontal numbered step circles with connecting lines
 */

interface Step {
  label: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps): string {
  return `
    <div class="w-full py-4">
      <div class="flex items-center justify-center">
        ${steps.map((step, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          const isLast = i === steps.length - 1;

          const circleClass = isCompleted
            ? 'bg-primary-500 text-white'
            : isActive
              ? 'border-2 border-primary-500 text-primary-500 bg-white'
              : 'border-2 border-gray-300 text-gray-400 bg-white';

          const lineClass = isCompleted ? 'bg-primary-500' : 'bg-gray-300';

          return `
            <div class="flex items-center ${isLast ? '' : 'flex-1'}">
              <div class="flex flex-col items-center">
                <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${circleClass}">
                  ${isCompleted
                    ? `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`
                    : stepNum}
                </div>
                <span class="hidden sm:block text-xs mt-1.5 text-center whitespace-nowrap ${isActive ? 'text-primary-600 font-medium' : 'text-gray-500'}">${step.label}</span>
              </div>
              ${!isLast ? `<div class="flex-1 h-0.5 mx-2 sm:mx-3 ${lineClass}"></div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
