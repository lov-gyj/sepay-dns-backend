import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv(); // tự động đọc biến môi trường

export default redis;
