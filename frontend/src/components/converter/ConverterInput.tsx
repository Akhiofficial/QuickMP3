"use client"
import React from 'react';

const ConverterInput = () => {
    return (
        <div className="flex w-full max-w-lg flex-col gap-4">
            <input 
                type="text" 
                placeholder="Paste YouTube link here..." 
                className="w-full rounded-lg border border-white/20 bg-white/10 p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="rounded-lg bg-blue-600 p-4 font-bold text-white hover:bg-blue-700">
                Convert to MP3
            </button>
        </div>
    );
};

export default ConverterInput;
