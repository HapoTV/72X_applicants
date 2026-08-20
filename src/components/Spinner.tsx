import React from 'react';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerColor = 'white' | 'primary' | 'blue' | 'gray' | 'current';

interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
}

const SIZE: Record<SpinnerSize, string> = {
  xs: 'w-3 h-3 border-2',
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-4',
  lg: 'w-10 h-10 border-4',
  xl: 'w-12 h-12 border-4',
};

const COLOR: Record<SpinnerColor, string> = {
  white:   'border-white border-t-transparent',
  primary: 'border-primary-200 border-t-primary-500',
  blue:    'border-blue-200 border-t-blue-600',
  gray:    'border-gray-200 border-t-gray-600',
  current: 'border-current border-t-transparent',
};

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'primary', className = '' }) => (
  <div
    role="status"
    aria-label="Loading"
    className={`rounded-full animate-spin ${SIZE[size]} ${COLOR[color]} ${className}`}
  />
);

export default Spinner;
