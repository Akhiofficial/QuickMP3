import 'dotenv/config';

const config = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI,
    env: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3001',
};

export default config;
