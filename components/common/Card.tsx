
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    return (
        <div
            className={`glass-card rounded-2xl p-6 md:p-8 transition-all duration-300 ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
