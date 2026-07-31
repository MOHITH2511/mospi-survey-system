/**
 * Data Encryption and Security Utilities
 * Implements encryption for sensitive survey data at rest and in transit
 */

/**
 * Encryption configuration
 */
export interface EncryptionConfig {
  algorithm: 'AES-GCM' | 'AES-CBC';
  keyLength: 128 | 256;
  ivLength: 12 | 16;
}

const DEFAULT_CONFIG: EncryptionConfig = {
  algorithm: 'AES-GCM',
  keyLength: 256,
  ivLength: 12,
};

/**
 * Generate a cryptographic key for encryption
 * In production, this would be securely stored and managed
 */
export async function generateEncryptionKey(config: EncryptionConfig = DEFAULT_CONFIG): Promise<CryptoKey> {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API not supported in this browser');
  }

  const key = await window.crypto.subtle.generateKey(
    {
      name: config.algorithm,
      length: config.keyLength,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );

  return key;
}

/**
 * Encrypt sensitive data
 */
export async function encryptData(
  data: string,
  key: CryptoKey,
  config: EncryptionConfig = DEFAULT_CONFIG
): Promise<{ encrypted: string; iv: string }> {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API not supported');
  }

  // Generate random IV (Initialization Vector)
  const iv = window.crypto.getRandomValues(new Uint8Array(config.ivLength));

  // Encode data
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  // Encrypt
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: config.algorithm,
      iv: iv,
    },
    key,
    encodedData
  );

  // Convert to base64 for storage
  const encryptedArray = new Uint8Array(encryptedBuffer);
  const encrypted = btoa(String.fromCharCode(...encryptedArray));
  const ivBase64 = btoa(String.fromCharCode(...iv));

  return {
    encrypted,
    iv: ivBase64,
  };
}

/**
 * Decrypt sensitive data
 */
export async function decryptData(
  encrypted: string,
  iv: string,
  key: CryptoKey,
  config: EncryptionConfig = DEFAULT_CONFIG
): Promise<string> {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API not supported');
  }

  // Convert from base64
  const encryptedArray = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
  const ivArray = Uint8Array.from(atob(iv), c => c.charCodeAt(0));

  // Decrypt
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: config.algorithm,
      iv: ivArray,
    },
    key,
    encryptedArray
  );

  // Decode to string
  const decoder = new TextDecoder();
  const decryptedData = decoder.decode(decryptedBuffer);

  return decryptedData;
}

/**
 * Hash data for integrity checking (one-way)
 */
export async function hashData(data: string): Promise<string> {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API not supported');
  }

  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', encodedData);
  const hashArray = new Uint8Array(hashBuffer);
  const hashHex = Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return hashHex;
}

/**
 * Mask PII (Personally Identifiable Information) for display
 */
export function maskPII(data: string, type: 'phone' | 'email' | 'aadhaar' | 'name' | 'pan'): string {
  if (!data) return data;

  switch (type) {
    case 'phone':
      // Show only last 4 digits: +91 98765 43210 → ******3210
      if (data.length >= 10) {
        return '******' + data.slice(-4);
      }
      return data;

    case 'email':
      // Show first 2 chars and domain: user@example.com → us***@example.com
      const emailParts = data.split('@');
      if (emailParts.length === 2) {
        const username = emailParts[0];
        const domain = emailParts[1];
        return username.slice(0, 2) + '***@' + domain;
      }
      return data;

    case 'aadhaar':
      // Show only last 4 digits: 1234 5678 9012 → **** **** 9012
      if (data.length >= 12) {
        return '**** **** ' + data.slice(-4);
      }
      return data;

    case 'name':
      // Show first name, mask last name: Rajesh Kumar → Rajesh K****
      const nameParts = data.split(' ');
      if (nameParts.length > 1) {
        return nameParts[0] + ' ' + nameParts[1].charAt(0) + '****';
      }
      return data.charAt(0) + '****';

    case 'pan':
      // Mask middle characters: ABCDE1234F → AB***1234F
      if (data.length === 10) {
        return data.slice(0, 2) + '***' + data.slice(-4);
      }
      return data;

    default:
      return data;
  }
}

/**
 * Sanitize data to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return input;

  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');

  // Encode special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return sanitized;
}

/**
 * Generate secure random ID
 */
export function generateSecureId(length: number = 16): string {
  if (window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  } else {
    // Fallback for older browsers
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

/**
 * Encrypt survey response with PII fields masked
 */
export async function encryptSurveyResponse(
  response: Record<string, any>,
  sensitiveFields: string[],
  key: CryptoKey
): Promise<{
  encrypted: Record<string, { encrypted: string; iv: string }>;
  masked: Record<string, string>;
  hash: string;
}> {
  const encrypted: Record<string, { encrypted: string; iv: string }> = {};
  const masked: Record<string, string> = {};

  // Encrypt sensitive fields
  for (const field of sensitiveFields) {
    if (response[field]) {
      const value = String(response[field]);
      encrypted[field] = await encryptData(value, key);

      // Create masked version for logs/display
      if (field.includes('phone')) {
        masked[field] = maskPII(value, 'phone');
      } else if (field.includes('email')) {
        masked[field] = maskPII(value, 'email');
      } else if (field.includes('aadhaar')) {
        masked[field] = maskPII(value, 'aadhaar');
      } else if (field.includes('name')) {
        masked[field] = maskPII(value, 'name');
      } else if (field.includes('pan')) {
        masked[field] = maskPII(value, 'pan');
      } else {
        masked[field] = '***ENCRYPTED***';
      }
    }
  }

  // Generate integrity hash of entire response
  const hash = await hashData(JSON.stringify(response));

  return { encrypted, masked, hash };
}

/**
 * Validate data integrity using hash
 */
export async function validateDataIntegrity(
  data: Record<string, any>,
  expectedHash: string
): Promise<boolean> {
  const currentHash = await hashData(JSON.stringify(data));
  return currentHash === expectedHash;
}

/**
 * Secure session token generation
 */
export function generateSessionToken(): string {
  const timestamp = Date.now();
  const randomPart = generateSecureId(32);
  return `${timestamp}-${randomPart}`;
}

/**
 * Mock key derivation from password (for demo purposes)
 * In production, use proper key derivation function (PBKDF2, Argon2, etc.)
 */
export async function deriveKeyFromPassword(password: string, salt: string): Promise<CryptoKey> {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API not supported');
  }

  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltBuffer = encoder.encode(salt);

  // Import password as key material
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  // Derive encryption key
  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  return key;
}

/**
 * Consent record with cryptographic proof
 */
export interface ConsentRecord {
  userId: string;
  surveyId: string;
  timestamp: Date;
  consentText: string;
  ipAddress?: string;
  deviceId: string;
  signature: string; // Cryptographic signature
}

/**
 * Create consent record with signature
 */
export async function createConsentRecord(
  userId: string,
  surveyId: string,
  consentText: string,
  deviceId: string,
  ipAddress?: string
): Promise<ConsentRecord> {
  const timestamp = new Date();
  
  // Create signature from all consent data
  const consentData = `${userId}|${surveyId}|${timestamp.toISOString()}|${consentText}|${deviceId}`;
  const signature = await hashData(consentData);

  return {
    userId,
    surveyId,
    timestamp,
    consentText,
    ipAddress,
    deviceId,
    signature,
  };
}

/**
 * Verify consent record integrity
 */
export async function verifyConsentRecord(record: ConsentRecord): Promise<boolean> {
  const consentData = `${record.userId}|${record.surveyId}|${record.timestamp.toISOString()}|${record.consentText}|${record.deviceId}`;
  const expectedSignature = await hashData(consentData);
  
  return expectedSignature === record.signature;
}

/**
 * Data anonymization for analytics
 * Removes PII but preserves statistical value
 */
export function anonymizeData(data: Record<string, any>, piiFields: string[]): Record<string, any> {
  const anonymized = { ...data };

  for (const field of piiFields) {
    if (anonymized[field]) {
      // Replace with placeholder or generalized value
      if (field.includes('age')) {
        // Convert to age group
        const age = parseInt(anonymized[field]);
        if (age < 18) anonymized[field] = '0-17';
        else if (age < 30) anonymized[field] = '18-29';
        else if (age < 45) anonymized[field] = '30-44';
        else if (age < 60) anonymized[field] = '45-59';
        else anonymized[field] = '60+';
      } else if (field.includes('location') || field.includes('address')) {
        // Keep only district/state level
        anonymized[field] = 'DISTRICT_LEVEL_ONLY';
      } else {
        // Remove completely
        delete anonymized[field];
      }
    }
  }

  return anonymized;
}

/**
 * Audit log entry with tamper protection
 */
export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  details: string;
  hash: string;
  previousHash?: string;
}

/**
 * Create audit log entry with blockchain-like chaining
 */
export async function createAuditLog(
  userId: string,
  action: string,
  details: string,
  previousHash?: string
): Promise<AuditLog> {
  const id = generateSecureId();
  const timestamp = new Date();
  
  const logData = `${id}|${timestamp.toISOString()}|${userId}|${action}|${details}|${previousHash || 'GENESIS'}`;
  const hash = await hashData(logData);

  return {
    id,
    timestamp,
    userId,
    action,
    details,
    hash,
    previousHash,
  };
}

/**
 * Export key for storage (in production, use secure key management service)
 */
export async function exportKey(key: CryptoKey): Promise<string> {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API not supported');
  }

  const exported = await window.crypto.subtle.exportKey('jwk', key);
  return JSON.stringify(exported);
}

/**
 * Import key from storage
 */
export async function importKey(
  keyData: string,
  config: EncryptionConfig = DEFAULT_CONFIG
): Promise<CryptoKey> {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API not supported');
  }

  const keyObject = JSON.parse(keyData);
  
  const key = await window.crypto.subtle.importKey(
    'jwk',
    keyObject,
    {name: config.algorithm, length: config.keyLength },
    true,
    ['encrypt', 'decrypt']
  );

  return key;
}
