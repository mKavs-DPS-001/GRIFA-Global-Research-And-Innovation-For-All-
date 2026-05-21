import dotenv from 'dotenv';
dotenv.config();

// Simple in-memory fallback if no Redis URL (to keep dev simple and avoid external dependencies right now)
const memoryCache = new Map();

class RedisClient {
  async incr(key) {
    const val = (memoryCache.get(key) || 0) + 1;
    memoryCache.set(key, val);
    return val;
  }
  async get(key) {
    return memoryCache.get(key) || 0;
  }
}

export const redis = new RedisClient();
