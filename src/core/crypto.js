/**
 * Derives an export-protected CryptoKey from a user password.
 * @param {string} password - The master user secret.
 * @param {Uint8Array} salt - Unique random salt value.
 */
async function deriveKey(password, salt) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Import raw password text into a base keying material format
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Derive a high-entropy 256-bit AES-GCM key
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false, // key is non-exportable out of memory context
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a raw text string (CSV data) using AES-GCM.
 * @param {string} rawData - The plain text CSV transaction data.
 * @param {string} password - The master user secret.
 * @returns {Promise<{encryptedData: ArrayBuffer, salt: Uint8Array, iv: Uint8Array}>}
 */
export async function encryptPayload(rawData, password) {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Standard 96-bit IV
  
  const key = await deriveKey(password, salt);
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(rawData);

  const encryptedData = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encodedData
  );

  return { encryptedData, salt, iv };
}

/**
 * Decrypts an encrypted ArrayBuffer back into plain text CSV string.
 */
export async function decryptPayload(encryptedData, password, salt, iv) {
  const key = await deriveKey(password, salt);
  const decoder = new TextDecoder();

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encryptedData
  );

  return decoder.decode(decryptedBuffer);
}
