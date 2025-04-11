import rateLimit from 'express-rate-limit';

import config from '@/config';

const { rateLimit: rateLimitConfig } = config;

const rateLimitMiddleware = rateLimit({
  windowMs: rateLimitConfig.windowMs,
  max: Number(rateLimitConfig.max),
  message: 'Looks like you are moving too fast. Retry again in few minutes.'
});

export default rateLimitMiddleware;
