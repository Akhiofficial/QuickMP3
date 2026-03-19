/**
 * Simple API client for the YtMP3 application.
 * Handles making requests to the backend server.
 */

export const getYouTubeMetadata = async (url: string) => {
    // Placeholder implementation
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/metadata`, {
            method: 'POST',
            body: JSON.stringify({ url }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch metadata:', error);
        throw error;
    }
};

export const startConversion = async (url: string) => {
    // Placeholder implementation
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/convert`, {
            method: 'POST',
            body: JSON.stringify({ url }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Failed to start conversion:', error);
        throw error;
    }
};
