// Simple in-memory rate limiter for MVP
// In production, use Redis or similar distributed store

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

class InMemoryRateLimiter {
  private store = new Map<string, RateLimitEntry>()
  
  constructor(private config: RateLimitConfig) {
    // Clean up expired entries every 5 minutes
    setInterval(() => {
      const now = Date.now()
      for (const [key, entry] of this.store.entries()) {
        if (entry.resetTime < now) {
          this.store.delete(key)
        }
      }
    }, 5 * 60 * 1000)
  }

  async checkLimit(key: string): Promise<{ 
    allowed: boolean
    count: number
    resetTime: number
    retryAfter?: number
  }> {
    const now = Date.now()
    const entry = this.store.get(key)

    if (!entry || entry.resetTime < now) {
      // First request or window expired
      const resetTime = now + this.config.windowMs
      const newEntry: RateLimitEntry = { count: 1, resetTime }
      this.store.set(key, newEntry)
      
      return {
        allowed: true,
        count: 1,
        resetTime
      }
    }

    // Increment existing entry
    entry.count++
    this.store.set(key, entry)

    const allowed = entry.count <= this.config.maxRequests
    const retryAfter = allowed ? undefined : Math.ceil((entry.resetTime - now) / 1000)

    return {
      allowed,
      count: entry.count,
      resetTime: entry.resetTime,
      retryAfter
    }
  }
}

// Rate limit configurations
const RATE_LIMITS = {
  // Per IP limits (basic DDoS protection)
  trainer_ip: new InMemoryRateLimiter({ windowMs: 60 * 1000, maxRequests: 10 }), // 10 per minute
  chat_ip: new InMemoryRateLimiter({ windowMs: 60 * 1000, maxRequests: 30 }), // 30 per minute
  
  // Per twin limits (prevent abuse of specific twins)
  trainer_twin: new InMemoryRateLimiter({ windowMs: 60 * 1000, maxRequests: 20 }), // 20 per minute
  chat_twin: new InMemoryRateLimiter({ windowMs: 60 * 1000, maxRequests: 100 }), // 100 per minute
}

export async function checkTrainerRateLimit(
  ip: string,
  twinId: string
): Promise<{ allowed: boolean, retryAfter?: number, reason?: string }> {
  // Check IP limit first (more restrictive)
  const ipLimit = await RATE_LIMITS.trainer_ip.checkLimit(`ip:${ip}`)
  if (!ipLimit.allowed) {
    return {
      allowed: false,
      retryAfter: ipLimit.retryAfter,
      reason: 'IP rate limit exceeded'
    }
  }

  // Check twin-specific limit
  const twinLimit = await RATE_LIMITS.trainer_twin.checkLimit(`twin:${twinId}`)
  if (!twinLimit.allowed) {
    return {
      allowed: false,
      retryAfter: twinLimit.retryAfter,
      reason: 'Twin training rate limit exceeded'
    }
  }

  return { allowed: true }
}

export async function checkChatRateLimit(
  ip: string,
  twinId: string
): Promise<{ allowed: boolean, retryAfter?: number, reason?: string }> {
  // Check IP limit first
  const ipLimit = await RATE_LIMITS.chat_ip.checkLimit(`ip:${ip}`)
  if (!ipLimit.allowed) {
    return {
      allowed: false,
      retryAfter: ipLimit.retryAfter,
      reason: 'IP rate limit exceeded'
    }
  }

  // Check twin-specific limit  
  const twinLimit = await RATE_LIMITS.chat_twin.checkLimit(`twin:${twinId}`)
  if (!twinLimit.allowed) {
    return {
      allowed: false,
      retryAfter: twinLimit.retryAfter,
      reason: 'Twin chat rate limit exceeded'
    }
  }

  return { allowed: true }
}

// Helper to get client IP from Next.js request
export function getClientIP(request: Request): string {
  // Try various headers for IP (in order of preference)
  const headers = [
    'x-forwarded-for',
    'x-real-ip',
    'x-client-ip',
    'cf-connecting-ip', // Cloudflare
    'x-forwarded',
    'forwarded-for',
    'forwarded'
  ]

  for (const header of headers) {
    const value = request.headers.get(header)
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      const ip = value.split(',')[0].trim()
      if (ip && ip !== 'unknown') {
        return ip
      }
    }
  }

  // Fallback to 'unknown' if no IP found
  return 'unknown'
}