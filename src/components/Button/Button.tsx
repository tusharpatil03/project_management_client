import React from 'react';
import clsx from 'clsx';
import Loader from '../Loader';

type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'primary' | 'secondary' | 'tab' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50',
  secondary:
    'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50',
  tab: `pb-2 border-b-2 text-sm transition`,
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
};

const Button: React.FC<ButtonProps> = ({
  children,
  size = 'md',
  variant = 'primary',
  loading = false,
  disabled,
  fullWidth = false,
  onClick,
  className,
  ...rest
}) => {
  const isTab = variant === 'tab';

  const combinedClassName = clsx(
    'rounded-md font-semibold transition duration-200',
    !isTab && sizeClasses[size],
    variantClasses[variant],
    fullWidth && 'w-full',
    className
  );

  return (
    <button onClick={onClick}
      className={combinedClassName}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loader/> : children}
    </button>
  );
};

export default Button;