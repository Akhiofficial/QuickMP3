# YtMP3 Backend

A robust backend for the YouTube to MP3 converter application, built with Express.js and MongoDB.

## Features
- YouTube Metadata Extraction
- High-quality MP3 conversion using ffmpeg and yt-dlp
- Modular architecture
- Error handling and logging

## Project Structure
```text
backend/
├── src/
│   ├── modules/                     # feature-based modules
│   ├── core/                        # app core (db, config, middlewares)
│   ├── services/                    # external tool wrappers
│   ├── utils/                       # helper functions
│   ├── app.js                       # express configuration
│   └── server.js                    # server entry point
├── downloads/                       # temporary storage
└── logs/                            # application logs
```

## Setup
1. `npm install`
2. Create `.env` file with `MONGO_URI`
3. `npm run dev`
