// Reusable Spinner component
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  label?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'blue',
  className,
  label,
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  // Border width classes
  const borderWidthClasses = {
    sm: 'border-2',
    md: 'border-4',
    lg: 'border-4',
  };

  // Color classes
  const colorClasses = {
    blue: 'border-blue-500',
    gray: 'border-gray-500',
    white: 'border-white',
    black: 'border-black',
    red: 'border-red-500',
    green: 'border-green-500',
    yellow: 'border-yellow-500',
  };

  // Determine the color class, default to blue if custom color is provided
  const getColorClass = () => {
    return colorClasses[color as keyof typeof colorClasses] || `border-${color}`;
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <motion.div
        className={cn(
          'rounded-full border-t-transparent',
          sizeClasses[size],
          borderWidthClasses[size],
          getColorClass()
        )}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: 'linear',
        }}
      />
      {label && (
        <span className="mt-2 text-sm text-gray-600">{label}</span>
      )}
    </div>
  );
};

// Alternative spinner using SVG for more customization
interface SvgSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  strokeWidth?: number;
  speed?: 'slow' | 'normal' | 'fast';
}

const SvgSpinner: React.FC<SvgSpinnerProps> = ({
  size = 'md',
  color = 'blue-500',
  className,
  strokeWidth = 2,
  speed = 'normal',
}) => {
  // Size dimensions
  const sizeDimensions = {
    sm: 20,
    md: 40,
    lg: 60,
  };

  // Animation duration based on speed
  const speedDuration = {
    slow: 1.5,
    normal: 1,
    fast: 0.5,
  };

  const dimension = sizeDimensions[size];

  return (
    <motion.svg
      className={className}
      width={dimension}
      height={dimension}
      viewBox={`0 0 ${dimension} ${dimension}`}
      initial="initial"
      animate="animate"
    >
      <motion.circle
        cx={dimension / 2}
        cy={dimension / 2}
        r={dimension / 2 - strokeWidth}
        fill="none"
        stroke={`rgb(var(--${color.replace('-', '')}))`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={`rotate(-90 ${dimension / 2} ${dimension / 2})`}
        initial={{
          strokeDasharray: dimension * Math.PI,
          strokeDashoffset: dimension * Math.PI,
        }}
        variants={{
          animate: {
            strokeDashoffset: [dimension * Math.PI, 0, -dimension * Math.PI],
          },
        }}
        transition={{
          duration: speedDuration[speed],
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.svg>
  );
};

export { Spinner, SvgSpinner };