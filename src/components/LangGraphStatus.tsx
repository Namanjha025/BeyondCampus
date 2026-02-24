// Component to display LangGraph service status
import { useLangGraphHealth } from '@/lib/langgraph-health'

export function LangGraphStatus() {
  const { health, isLoading, checkHealth, isHealthy, status } = useLangGraphHealth()

  if (isLoading && !health) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
        Checking AI services...
      </div>
    )
  }

  if (!health) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <div className="w-2 h-2 bg-red-500 rounded-full" />
        AI services unavailable
      </div>
    )
  }

  const getStatusColor = () => {
    switch (status) {
      case 'healthy': return 'text-green-600'
      case 'degraded': return 'text-yellow-600' 
      case 'unhealthy': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getDotColor = () => {
    switch (status) {
      case 'healthy': return 'bg-green-500'
      case 'degraded': return 'bg-yellow-500'
      case 'unhealthy': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = () => {
    const { trainer, chat } = health
    if (trainer && chat) return 'AI services online'
    if (trainer) return 'Training available'
    if (chat) return 'Chat available'
    return 'AI services offline'
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${getStatusColor()}`}>
      <div className={`w-2 h-2 ${getDotColor()} rounded-full`} />
      {getStatusText()}
      {health.errors.length > 0 && (
        <span className="text-xs text-gray-400">
          ({health.errors.length} issue{health.errors.length !== 1 ? 's' : ''})
        </span>
      )}
      <button
        onClick={() => checkHealth(true)}
        className="ml-2 text-xs text-gray-400 hover:text-gray-600"
        disabled={isLoading}
      >
        {isLoading ? '...' : '↻'}
      </button>
    </div>
  )
}

export function LangGraphStatusBadge() {
  const { status, isHealthy } = useLangGraphHealth()
  
  if (isHealthy) return null // Don't show badge when everything is working
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
          <span>AI services {status}</span>
        </div>
      </div>
    </div>
  )
}