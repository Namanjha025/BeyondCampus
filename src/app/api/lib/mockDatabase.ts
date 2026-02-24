// Mock database for demo - In production, replace with your actual database
import fs from 'fs'
import path from 'path'

interface Twin {
  id: string
  userId: string
  userName: string
  twinName: string
  tagline: string
  personality: string
  tone: string
  links: any[]
  status: 'TRAINING' | 'PUBLISHED'
  createdAt: string
  publishedAt?: string
  publicUrl?: string
}

// File-based persistence for development
const DB_FILE = path.join(process.cwd(), '.next', 'twins-db.json')

const loadData = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
      return { twins: data.twins || [], currentId: data.currentId || 1 }
    }
  } catch (error) {
    console.warn('Error loading twin data:', error)
  }
  return { twins: [], currentId: 1 }
}

const saveData = (twins: Twin[], currentId: number) => {
  try {
    // Ensure .next directory exists
    const nextDir = path.dirname(DB_FILE)
    if (!fs.existsSync(nextDir)) {
      fs.mkdirSync(nextDir, { recursive: true })
    }
    
    fs.writeFileSync(DB_FILE, JSON.stringify({ twins, currentId }, null, 2))
  } catch (error) {
    console.warn('Error saving twin data:', error)
  }
}

// Load initial data
let { twins, currentId } = loadData()
console.log('Loaded twins from storage:', twins.length)

export const mockDatabase = {
  // Create a new twin
  createTwin: (twinData: Omit<Twin, 'id' | 'createdAt'>, customId?: string): Twin => {
    const twin: Twin = {
      ...twinData,
      id: customId || `twin_${currentId++}`,
      createdAt: new Date().toISOString()
    }
    
    twins.push(twin)
    saveData(twins, currentId)
    console.log('Twin created in mock DB:', twin)
    return twin
  },

  // Find twin by ID
  findTwin: (twinId: string, userId?: string): Twin | undefined => {
    // Reload data to ensure we have the latest
    const data = loadData()
    twins = data.twins
    currentId = data.currentId
    
    const twin = twins.find(t => t.id === twinId && (!userId || t.userId === userId))
    console.log('Finding twin:', twinId, 'for user:', userId, 'found:', !!twin)
    console.log('Current twins in database:', twins.length)
    return twin
  },

  // Update twin
  updateTwin: (twinId: string, updates: Partial<Twin>): Twin | null => {
    // Reload data first
    const data = loadData()
    twins = data.twins
    currentId = data.currentId
    
    const twinIndex = twins.findIndex(t => t.id === twinId)
    if (twinIndex === -1) {
      console.log('Twin not found for update:', twinId)
      return null
    }

    twins[twinIndex] = { ...twins[twinIndex], ...updates }
    saveData(twins, currentId)
    console.log('Twin updated:', twins[twinIndex])
    return twins[twinIndex]
  },

  // Get all twins (for debugging)
  getAllTwins: (): Twin[] => {
    // Reload data to ensure we have the latest
    const data = loadData()
    twins = data.twins
    currentId = data.currentId
    return twins
  },

  // Clear all data (for testing)
  clearAll: (): void => {
    twins = []
    currentId = 1
    saveData(twins, currentId)
  }
}

export type { Twin }