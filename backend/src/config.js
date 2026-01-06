import dotenv from 'dotenv';
dotenv.config();

export const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_secret_change_me';
export const PORT = Number(process.env.PORT || 8080);
export const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
export const ALLOW_DEV_LOGIN = process.env.ALLOW_DEV_LOGIN === 'true';
