import React from 'react';
import { motion } from 'framer-motion';

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function ProgressSteps({ steps, currentStep, className = '' }: ProgressStepsProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{
                scale: index <= currentStep ? 1 : 0.8,
                backgroundColor: index <= currentStep ? '#3b82f6' : '#334155',
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                index <= currentStep ? 'text-white' : 'text-secondary-400'
              }`}
            >
              {index < currentStep ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </motion.div>
            <span className={`text-xs mt-2 font-medium ${index <= currentStep ? 'text-primary-400' : 'text-secondary-500'}`}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-1 mx-2 rounded-full bg-secondary-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: index < currentStep ? '100%' : '0%' }}
                transition={{ duration: 0.3 }}
                className="h-full bg-primary-500"
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizeStyles[size]} relative`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-full h-full rounded-full border-2 border-secondary-700 border-t-primary-500"
      />
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-cinema-dark flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto rounded-full border-4 border-secondary-700 border-t-primary-500 animate-spin" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-secondary-400"
        >
          Loading your cinema experience...
        </motion.p>
      </div>
    </div>
  );
}
