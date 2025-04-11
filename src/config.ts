import * as dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 3001,
  mongoConnectionUrl: process.env.MONGODB,
  allowedOrigins: process.env.ALLOWED_ORIGINS || '*',
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX || 100
  }
};
