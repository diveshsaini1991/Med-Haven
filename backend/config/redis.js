import { Redis } from '@upstash/redis';

import { config } from 'dotenv';
config({ path: './config/config.env' });

const redis = Redis.fromEnv();

export default redis;
