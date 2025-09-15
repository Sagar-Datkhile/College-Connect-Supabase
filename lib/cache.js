// Simple in-memory cache with TTL support
class MemoryCache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttl = 300000) { // Default 5 minutes TTL
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  // Clean expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

export const cache = new MemoryCache();

// Cleanup expired entries every 10 minutes
if (typeof window === 'undefined') { // Server-side only
  setInterval(() => {
    cache.cleanup();
  }, 600000);
}

export function cacheResponse(key, data, ttl) {
  cache.set(key, data, ttl);
}

export function getCachedResponse(key) {
  return cache.get(key);
}

export function invalidateCache(pattern) {
  if (typeof pattern === 'string') {
    cache.delete(pattern);
  } else if (pattern instanceof RegExp) {
    for (const key of cache.cache.keys()) {
      if (pattern.test(key)) {
        cache.delete(key);
      }
    }
  }
}
