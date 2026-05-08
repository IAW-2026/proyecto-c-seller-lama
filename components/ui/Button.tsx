import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  primaryColor?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-slate-900 text-white hover:bg-slate-800',
  secondary: 'border-2 hover:bg-slate-50',
  ghost: 'text-slate-700 hover:bg-slate-50'
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  primaryColor = '#515922',
  className,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium transition-colors duration-200 rounded-lg';
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  let customStyle = {};
  if (variant === 'secondary' || variant === 'ghost') {
    customStyle = { color: primaryColor, borderColor: primaryColor };
  }

  return (
    <button
      className={`${baseStyles} ${variantStyle} ${sizeStyle} ${className || ''}`}
      style={customStyle}
      {...props}
    >
      {children}
    </button>
  );
}
