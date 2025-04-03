require('dotenv').config(); //Load environment variables from .env

export const config = {
    valid: {
        username: process.env.VALID_USERNAME,
        password: process.env.VALID_PASSWORD,
    },
};

if (!config.valid.username || !config.valid.password) {
    throw new Error('Valid username or password not found in environment variables.');
}