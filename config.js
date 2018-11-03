require("dotenv").config();

module.exports = {
    PORT: process.env.PORT || 5000,
    TOKEN: process.env.TOKEN,
    PROXY: process.env.PROXY,
    CHAT_ID: process.env.CHAT_ID,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD
};