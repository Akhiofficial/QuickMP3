import 'dotenv/config';

const config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI,
    env: process.env.NODE_ENV || 'development',
    corsOrigin: [
        'http://localhost:3000',
        'https://quick-mp-3.vercel.app',
        ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) : [])
    ],
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || 'access_secret_key',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_key',
        accessExpiry: process.env.ACCESS_TOKEN_EXPIRY || '15m',
        refreshExpiry: process.env.REFRESH_TOKEN_EXPIRY || '7d',
    },
    supabase: {
        url: process.env.SUPABASE_URL,
        anonKey: process.env.SUPABASE_ANON_KEY,
        bucket: process.env.SUPABASE_BUCKET || 'ytmp3-files',
    }
};

export default config;
