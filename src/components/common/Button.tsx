import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'danger' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    xs: 'px-2.5 py-1 text-xs rounded-lg gap-1.5',
    sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm font-medium rounded-xl gap-2',
    lg: 'px-5 py-2.5 text-sm font-semibold rounded-xl gap-2.5'
  };

  const variantClasses = {
    primary:
      'bg-[#0b1e36] text-white hover:bg-[#162f50] active:bg-[#071322] shadow-xs shadow-slate-900/10 border border-[#0b1e36]',
    secondary:
      'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 border border-slate-200 shadow-2xs',
    gold:
      'bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-700 hover:to-amber-600 active:opacity-95 shadow-xs shadow-amber-900/10 border border-amber-600',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-xs shadow-rose-900/10 border border-rose-600',
    ghost:
      'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent',
    outline:
      'bg-transparent text-slate-700 hover:bg-slate-50 border border-slate-300'
  };

  const displayClass = className.includes('hidden') || className.includes('block') || className.includes('flex')
    ? ''
    : 'inline-flex';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${displayClass} items-center justify-center transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
