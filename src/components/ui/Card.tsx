import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  bordered = true,
  hoverable = false,
}) => {
  // Base styles
  const baseStyles = 'bg-white font-mono';
  
  // Border styles
  const borderStyles = bordered ? 'border-2 border-black' : '';
  
  // Hover styles
  const hoverStyles = hoverable ? 'transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : '';

  return (
    <div
      className={`
        ${baseStyles}
        ${borderStyles}
        ${hoverStyles}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;