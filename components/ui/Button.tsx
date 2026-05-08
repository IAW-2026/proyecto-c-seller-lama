import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[#8fa18d] text-white hover:bg-[#6f7f6d] active:scale-95 shadow-lg shadow-[#8fa18d]/25',
  secondary: 'bg-[#ede6d8] text-[#37413d] hover:bg-[#8fa18d]/10 active:scale-95',
  outline: 'border-2 border-[#8fa18d] text-[#8fa18d] hover:bg-[#8fa18d] hover:text-white active:scale-95',
  ghost: 'text-[#6f7f6d] hover:bg-[#8fa18d]/5 active:scale-95'
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
  isLoading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold transition-all duration-200 rounded-lg inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <button
      className={`${baseStyles} ${variantStyle} ${sizeStyle} ${className || ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
