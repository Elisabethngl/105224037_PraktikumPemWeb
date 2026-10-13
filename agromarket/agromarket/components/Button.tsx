import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-emerald-700 hover:bg-emerald-800 text-white focus:ring-emerald-600 shadow-md hover:shadow-lg disabled:bg-emerald-400',
    secondary: 'bg-amber-500 hover:bg-amber-600 text-gray-900 focus:ring-amber-400 shadow-md disabled:bg-amber-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow disabled:bg-red-300',
    outline: 'border-2 border-emerald-700 text-emerald-800 hover:bg-emerald-50 focus:ring-emerald-600 disabled:border-gray-300 disabled:text-gray-400'
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'cursor-not-allowed opacity-75' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};