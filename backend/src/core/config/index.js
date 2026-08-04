import 'dotenv/config';

const config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI,
    env: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
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
    },
    rapidapi: {
        key: process.env.RAPIDAPI_KEY,
        host: process.env.RAPIDAPI_HOST || 'youtube-mp36.p.rapidapi.com',
    },
    email: {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID,
        keySecret: process.env.RAZORPAY_KEY_SECRET,
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};

export default config;
