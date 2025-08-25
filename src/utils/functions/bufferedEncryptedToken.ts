import { getOrCreateKey } from "./cryptoStorage";

// Encrypt before storage
async function encryptToken(token: string) {
  const key = await getOrCreateKey(); // Get the persistent key
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(token)
  );
  return { iv, encrypted };
}

// Decrypt when needed
async function decryptToken(encryptedData: any) {
  const key = await getOrCreateKey(); // Get the persistent key
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: encryptedData.iv },
    key,
    encryptedData.encrypted
  );
  return new TextDecoder().decode(decrypted);
}

export async function storeEncryptedToken(token: string) {
  try {
    const encryptedData:any = await encryptToken(token);
    const encryptedString = arrayBufferToBase64(encryptedData.encrypted);
    const ivString = arrayBufferToBase64(encryptedData.iv);
    
    localStorage.setItem('encryptedToken', encryptedString);
    localStorage.setItem('encryptionIV', ivString);
  } catch (error) {
    console.error('Token encryption failed:', error);
    throw error; // Re-throw to let calling code handle
  }
}

export async function storeEncryptedString(token: string) {
  try {
    const encryptedData:any = await encryptToken(token);
    const encryptedString = arrayBufferToBase64(encryptedData.encrypted);
    const ivString = arrayBufferToBase64(encryptedData.iv);
    
    localStorage.setItem('position', encryptedString);
    localStorage.setItem('encryptionIV', ivString);
    return encryptedString;
  } catch (error) {
    console.error('Token encryption failed:', error);
    throw error; // Re-throw to let calling code handle
  }
}

export async function getDecryptedToken() {
  try {
    const encryptedString = localStorage.getItem('encryptedToken');
    const ivString = localStorage.getItem('encryptionIV');
    
    if (!encryptedString || !ivString) return null;
    
    const encrypted = base64ToArrayBuffer(encryptedString);
    const iv = base64ToArrayBuffer(ivString);
    
    return await decryptToken({ iv: new Uint8Array(iv), encrypted });
  } catch (error) {
    console.error('Token decryption failed:', error);
    // Clear invalid tokens
    localStorage.removeItem('encryptedToken');
    localStorage.removeItem('encryptionIV');
    return null;
  }
}
export async function getDecryptedString() {
  try {
    const encryptedString = localStorage.getItem('position');
    const ivString = localStorage.getItem('encryptionIV');
    
    if (!encryptedString || !ivString) return null;
    
    const encrypted = base64ToArrayBuffer(encryptedString);
    const iv = base64ToArrayBuffer(ivString);
    
    return await decryptToken({ iv: new Uint8Array(iv), encrypted });
  } catch (error) {
    console.error('Token decryption failed:', error);
    // Clear invalid tokens
    localStorage.removeItem('encryptedToken');
    localStorage.removeItem('encryptionIV');
    return null;
  }
}
// Helper functions
function arrayBufferToBase64(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}