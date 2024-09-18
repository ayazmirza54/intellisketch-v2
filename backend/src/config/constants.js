require('dotenv').config();

module.exports = {
    SERVER_URL: '0.0.0.0',
    PORT: process.env.PORT || 80,
    ENV: process.env.NODE_ENV || 'development',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
};