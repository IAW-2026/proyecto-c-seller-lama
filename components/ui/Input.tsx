import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-medium text-[#37413d]">
          {label}
        </label>
      )}
      
      <input
        className={`
          px-4 py-2.5 rounded-lg
          border-2 border-[#8fa18d]/20
          bg-white text-[#37413d]
          placeholder-[#6f7f6d]/50
          focus:outline-none focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20
          transition-all duration-200
          disabled:bg-[#ede6d8] disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className || ''}
        `}
        {...props}
      />
      
      {error && (
        <span className="text-xs font-medium text-red-600">{error}</span>
      )}
      
      {helperText && !error && (
        <span className="text-xs text-[#6f7f6d]">{helperText}</span>
      )}
    </div>
  );
}
