import React from 'react';

const VideoPreview = () => {
    return (
        <div className="mt-8 flex w-full max-w-lg flex-col gap-4">
            <div className="aspect-video w-full rounded-lg bg-gray-800 flex items-center justify-center text-gray-500">
                Video Preview
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">Video Title</h3>
                <p className="text-gray-400">Duration: 0:00</p>
            </div>
        </div>
    );
};

export default VideoPreview;
