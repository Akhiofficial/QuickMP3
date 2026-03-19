"use client"
import { useState } from 'react';
import { startConversion, getYouTubeMetadata } from '../lib/api';

/**
 * Custom hook to handle YouTube to MP3 conversion state and logic.
 */
export const useConvert = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [videoData, setVideoData] = useState<any>(null);

    const convertVideo = async (url: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getYouTubeMetadata(url);
            setVideoData(data);
            const conversionData = await startConversion(url);
            return conversionData;
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
            console.error('Conversion error:', err);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, videoData, convertVideo };
};
