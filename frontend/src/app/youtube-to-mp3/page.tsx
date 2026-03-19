import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QuickMP3',
  description: 'Convert YouTube videos to high-quality MP3 files for free. Fast, secure, and easy to use.',
};

const YoutubeToMp3Page = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-center">QuickMP3 Converter</h1>
      <p className="mt-8 text-xl max-w-2xl text-center text-gray-400">
        Easily convert your favorite YouTube videos to MP3 format with our fast and secure tool. Just paste the link and hit convert.
      </p>
    </div>
  );
};

export default YoutubeToMp3Page;
