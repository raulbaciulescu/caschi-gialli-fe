/**
 * Utility functions for password encryption using Web Crypto API
 */

/**
 * Hash a password using SHA-256
 * @param password - The plain text password
 * @returns Promise<string> - The hashed password as hex string
 */
export async function hashPassword(password: string): Promise<string> {
  // Convert password to ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Hash the password using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert ArrayBuffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * Hash a password with salt using PBKDF2
 * @param password - The plain text password
 * @param salt - Optional salt (if not provided, email will be used as salt)
 * @returns Promise<string> - The hashed password as hex string
 */
export async function hashPasswordWithSalt(password: string, salt?: string): Promise<string> {
  const encoder = new TextEncoder();
  
  // Use provided salt or generate one from current timestamp
  const saltString = salt || Date.now().toString();
  const saltBuffer = encoder.encode(saltString);
  
  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  // Derive key using PBKDF2
  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000, // 100k iterations for security
      hash: 'SHA-256'
    },
    keyMaterial,
    256 // 256 bits = 32 bytes
  );
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(derivedKey));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * Simple password hashing for frontend (using email as salt for consistency)
 * @param password - The plain text password
 * @param email - User's email to use as salt
 * @returns Promise<string> - The hashed password
 */
export async function hashPasswordForAuth(password: string, email: string): Promise<string> {
  // Use email as salt for consistency across login/register
  return await hashPasswordWithSalt(password, email.toLowerCase());
}