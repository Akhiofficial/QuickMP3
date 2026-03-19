import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
    return (
        <input 
            className={`w-full rounded-lg border border-white/20 bg-white/10 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} 
            {...props} 
        />
    );
};
