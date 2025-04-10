import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    className = '',
    ...props
}) => {
    const baseStyles =
        'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed';

    const variantStyles = {
        primary:
            'bg-blue-600 text-white hover:bg-blue-700 border border-transparent',
        secondary:
            'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-transparent',
        outline:
            'bg-transparent text-gray-700 hover:bg-gray-100 border border-gray-300',
        danger: 'bg-red-600 text-white hover:bg-red-700 border border-transparent disabled:bg-gray-400',
    };

    const sizeStyles = {
        sm: 'text-xs px-2.5 py-1.5 rounded',
        md: 'text-sm px-4 py-2 rounded-md',
        lg: 'text-base px-6 py-3 rounded-md',
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            {...props}
        >
            {icon && <span className='mr-2'>{icon}</span>}
            {children}
        </button>
    );
};

export default Button;
