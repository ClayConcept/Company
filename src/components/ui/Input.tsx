import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, className = '', ...props }, ref) => {
    // Base styles
    const baseStyles = 'font-mono border border-black px-3 py-2 focus:outline-none bg-white';
    
    // Error styles
    const errorStyles = error ? 'border-red-600' : '';
    
    // Width style
    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <div className={`${fullWidth ? 'w-full' : ''} mb-2`}>
        {label && (
          <label className="block font-mono text-sm font-bold uppercase mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            ${baseStyles}
            ${errorStyles}
            ${widthStyle}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="font-mono text-xs text-red-600 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;