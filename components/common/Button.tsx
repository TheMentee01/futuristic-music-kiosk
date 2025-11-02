
import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    disabled?: boolean;
    type?: 'button' | 'submit';
    style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    className = '',
    variant = 'primary',
    disabled = false,
    type = 'button',
    style,
}) => {
    const baseClasses =
        'px-6 py-3 font-semibold rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-accent-purple/50 flex items-center justify-center gap-2';
    
    const variantClasses = {
        primary: 'gradient-button text-text-primary shadow-lg hover:shadow-glow-purple disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:scale-102',
        secondary: 'bg-bg-secondary border border-accent-cyan/50 text-accent-cyan hover:bg-accent-cyan/10 hover:shadow-glow-cyan disabled:opacity-50 disabled:cursor-not-allowed',
        ghost: 'bg-transparent text-text-secondary hover:text-text-primary',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        >
            {children}
        </button>
    );
};
