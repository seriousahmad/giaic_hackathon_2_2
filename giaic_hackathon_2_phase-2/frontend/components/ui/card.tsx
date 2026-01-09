// Reusable Card component with glassmorphism effect
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glassEffect?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg' | 'none';
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = true,
  glassEffect = true,
  padding = 'md',
  shadow = 'md',
}) => {
  // Padding classes
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  // Shadow classes
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  // Glassmorphism classes
  const glassClasses = glassEffect
    ? 'bg-white/80 backdrop-blur-sm border border-white/20'
    : 'bg-white border border-gray-200';

  // Hover effect classes
  const hoverClasses = hoverEffect ? 'transition-all duration-300 hover:shadow-xl' : '';

  return (
    <motion.div
      className={cn(
        'rounded-xl',
        glassClasses,
        shadowClasses[shadow],
        paddingClasses[padding],
        hoverClasses,
        className
      )}
      whileHover={hoverEffect ? { y: -5 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={cn('pb-4', className)}>{children}</div>
);

const CardBody: React.FC<CardBodyProps> = ({ children, className }) => (
  <div className={cn('', className)}>{children}</div>
);

const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => (
  <div className={cn('pt-4 mt-auto', className)}>{children}</div>
);

const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => (
  <h3 className={cn('text-xl font-semibold text-gray-800', className)}>
    {children}
  </h3>
);

const CardDescription: React.FC<CardDescriptionProps> = ({ children, className }) => (
  <p className={cn('text-sm text-gray-600 mt-2', className)}>
    {children}
  </p>
);

export { Card, CardHeader, CardBody, CardFooter, CardTitle, CardDescription };