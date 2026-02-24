import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

/**
 * Convert a NextAuth CUID to a deterministic UUID format
 * This ensures the same CUID always produces the same UUID
 */
export function cuidToUuid(cuid: string): string {
  // Create a deterministic hash from the CUID
  const hash = crypto.createHash('sha256').update(cuid).digest('hex');
  
  // Format as UUID v4 (8-4-4-4-12 format)
  const uuid = [
    hash.slice(0, 8),
    hash.slice(8, 12), 
    hash.slice(12, 16),
    hash.slice(16, 20),
    hash.slice(20, 32)
  ].join('-');
  
  return uuid;
}

/**
 * Generate a random UUID for new records (like twin IDs)
 */
export function generateUuid(): string {
  return uuidv4();
}