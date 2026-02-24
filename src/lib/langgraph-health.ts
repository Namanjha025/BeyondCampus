// Health check utilities for LangGraph services
import { useState, useCallback, useEffect } from 'react'
import { langGraphClient } from './langgraph-client'

export interface HealthStatus {
  trainer: boolean
  chat: boolean
  timestamp: number
  errors: string[]
}

let lastHealthCheck: HealthStatus | null = null
let lastHealthCheckTime = 0
const HEALTH_CHECK_CACHE_MS = 30000 // 30 seconds

export async function checkLangGraphHealth(forceRefresh = false): Promise<HealthStatus> {
  const now = Date.now()
  
  // Return cached result if recent and not forcing refresh
  if (!forceRefresh && lastHealthCheck && (now - lastHealthCheckTime) < HEALTH_CHECK_CACHE_MS) {
    return lastHealthCheck
  }
  
  const errors: string[] = []
  
  // Check trainer service
  let trainerHealthy = false
  try {
    trainerHealthy = await langGraphClient.healthCheck('trainer')
  } catch (error) {
    errors.push(`Trainer service: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
  
  // Check chat service
  let chatHealthy = false
  try {
    chatHealthy = await langGraphClient.healthCheck('chat')
  } catch (error) {
    errors.push(`Chat service: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
  
  const healthStatus: HealthStatus = {
    trainer: trainerHealthy,
    chat: chatHealthy,
    timestamp: now,
    errors
  }
  
  lastHealthCheck = healthStatus
  lastHealthCheckTime = now
  
  return healthStatus
}

export function isLangGraphHealthy(health: HealthStatus): boolean {
  return health.trainer && health.chat
}

export function getLangGraphStatus(): 'healthy' | 'degraded' | 'unhealthy' {
  if (!lastHealthCheck) return 'unhealthy'
  
  const { trainer, chat } = lastHealthCheck
  
  if (trainer && chat) return 'healthy'
  if (trainer || chat) return 'degraded'
  return 'unhealthy'
}

// React hook for health status
export function useLangGraphHealth() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const checkHealth = useCallback(async (forceRefresh = false) => {
    setIsLoading(true)
    try {
      const status = await checkLangGraphHealth(forceRefresh)
      setHealth(status)
    } catch (error) {
      console.error('Health check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  useEffect(() => {
    checkHealth()
    
    // Auto-refresh every minute
    const interval = setInterval(() => checkHealth(), 60000)
    return () => clearInterval(interval)
  }, [checkHealth])
  
  return {
    health,
    isLoading,
    checkHealth,
    isHealthy: health ? isLangGraphHealthy(health) : false,
    status: getLangGraphStatus()
  }
}

