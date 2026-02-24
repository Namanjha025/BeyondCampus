import { randomUUID } from 'crypto'

export interface ValidationError {
  code: string
  message: string
  field?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// UUID validation
export function isValidUUID(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(value)
}

// Generate UUIDv4 with optional prefix
export function generateUUID(prefix?: string): string {
  const uuid = randomUUID()
  return prefix ? `${prefix}_${uuid.slice(0, 8)}` : uuid
}

// Normalize ID - ensure it's UUIDv4 or generate one
export function normalizeId(value: string | undefined, prefix?: string): string {
  if (value && isValidUUID(value)) {
    return value
  }
  return generateUUID(prefix)
}

// Validation schemas
export function validateTrainerRequest(body: any): ValidationResult {
  const errors: ValidationError[] = []

  // Required fields
  if (!body.text || typeof body.text !== 'string' || body.text.trim().length === 0) {
    errors.push({
      code: 'MISSING_TEXT',
      message: 'Text message is required and cannot be empty',
      field: 'text'
    })
  }

  if (!body.thread_id || typeof body.thread_id !== 'string') {
    errors.push({
      code: 'MISSING_THREAD_ID', 
      message: 'thread_id is required',
      field: 'thread_id'
    })
  }

  // Optional field validation
  if (body.notebook_id && typeof body.notebook_id !== 'string') {
    errors.push({
      code: 'INVALID_NOTEBOOK_ID',
      message: 'notebook_id must be a string',
      field: 'notebook_id'
    })
  }

  if (body.chapter_id && typeof body.chapter_id !== 'string') {
    errors.push({
      code: 'INVALID_CHAPTER_ID',
      message: 'chapter_id must be a string', 
      field: 'chapter_id'
    })
  }

  // Length validation
  if (body.text && body.text.length > 10000) {
    errors.push({
      code: 'TEXT_TOO_LONG',
      message: 'Text message cannot exceed 10,000 characters',
      field: 'text'
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateChatRequest(body: any): ValidationResult {
  const errors: ValidationError[] = []

  // Required fields
  if (!body.text || typeof body.text !== 'string' || body.text.trim().length === 0) {
    errors.push({
      code: 'MISSING_TEXT',
      message: 'Text message is required and cannot be empty',
      field: 'text'
    })
  }

  // Optional field validation  
  if (body.notebook_id && typeof body.notebook_id !== 'string') {
    errors.push({
      code: 'INVALID_NOTEBOOK_ID',
      message: 'notebook_id must be a string',
      field: 'notebook_id'
    })
  }

  if (body.chapter_id && typeof body.chapter_id !== 'string') {
    errors.push({
      code: 'INVALID_CHAPTER_ID', 
      message: 'chapter_id must be a string',
      field: 'chapter_id'
    })
  }

  if (body.viewer_thread_id && typeof body.viewer_thread_id !== 'string') {
    errors.push({
      code: 'INVALID_THREAD_ID',
      message: 'viewer_thread_id must be a string',
      field: 'viewer_thread_id'
    })
  }

  // Length validation
  if (body.text && body.text.length > 10000) {
    errors.push({
      code: 'TEXT_TOO_LONG',
      message: 'Text message cannot exceed 10,000 characters',
      field: 'text'
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateSessionRequest(body: any): ValidationResult {
  const errors: ValidationError[] = []

  // Required fields
  if (!body.type || !['trainer', 'chat'].includes(body.type)) {
    errors.push({
      code: 'INVALID_SESSION_TYPE',
      message: 'Session type must be "trainer" or "chat"',
      field: 'type'
    })
  }

  // Optional field validation
  if (body.notebook_id && typeof body.notebook_id !== 'string') {
    errors.push({
      code: 'INVALID_NOTEBOOK_ID',
      message: 'notebook_id must be a string',
      field: 'notebook_id'
    })
  }

  if (body.chapter_id && typeof body.chapter_id !== 'string') {
    errors.push({
      code: 'INVALID_CHAPTER_ID',
      message: 'chapter_id must be a string',
      field: 'chapter_id'  
    })
  }

  if (body.thread_id && typeof body.thread_id !== 'string') {
    errors.push({
      code: 'INVALID_THREAD_ID',
      message: 'thread_id must be a string',
      field: 'thread_id'
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}