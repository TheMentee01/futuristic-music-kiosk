import React from 'react';

interface WorkflowProgressProps {
    steps: string[];
    currentStepIndex: number;
}

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);


export const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ steps, currentStepIndex }) => {
    const progressPercentage = currentStepIndex > 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0;

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={step} className="flex-1 flex flex-col items-center text-center relative">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                isCompleted ? 'bg-accent-cyan border-accent-cyan' : 
                                isCurrent ? 'border-accent-cyan scale-110' : 'border-text-secondary/50'
                            }`}>
                                {isCompleted ? (
                                    <CheckIcon className="w-5 h-5 text-bg-primary" />
                                ) : (
                                    <span className={`font-bold ${isCurrent ? 'text-accent-cyan' : 'text-text-secondary/50'}`}>{index + 1}</span>
                                )}
                            </div>
                            <p className={`mt-2 text-xs md:text-sm font-semibold transition-colors duration-300 ${
                                isCompleted ? 'text-accent-cyan' :
                                isCurrent ? 'text-text-primary' : 'text-text-secondary/50'
                            }`}>
                                {step}
                            </p>
                             {index < steps.length - 1 && (
                                <div className="absolute top-4 left-1/2 w-full h-0.5 bg-text-secondary/50" />
                            )}
                        </div>
                    );
                })}
            </div>
             <div className="w-full bg-bg-secondary rounded-full h-1.5">
                <div 
                    className="bg-gradient-to-r from-accent-cyan to-accent-purple h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercentage}%`}} 
                />
            </div>
        </div>
    );
};