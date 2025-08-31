import { Ratelimit } from '@upstash/ratelimit';
import redis from '../config/redis.js';

const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '30s'),
  prefix: '@myapp/ratelimit',
});

export async function rateLimitMiddleware(req, res, next) {
  try {
    const ip =
      req.ip ||
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      'unknown';

    const { success } = await rateLimiter.limit(ip);

    if (!success) {
      return res
        .status(429)
        .json({ message: 'Too many requests, please try again later.' });
    }
    next();
  } catch (error) {
    console.error('Rate limiting error:', error);
    next();
  }
}
