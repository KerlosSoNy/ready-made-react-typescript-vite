import { base64ToArrayBuffer } from "./bufferedEncryptedToken";
import { getOrCreateKey } from "./cryptoStorage";

let cryptoKey: CryptoKey | null = null;

export async function ensureCryptoKey() {
  if (!cryptoKey) {
    cryptoKey = await getOrCreateKey();
  }
  return cryptoKey;
}

export async function getDecryptedToken(): Promise<string | null> {
  try {
    await ensureCryptoKey();
    
    const encryptedString = localStorage.getItem('encryptedToken');
    const ivString = localStorage.getItem('encryptionIV');
    
    if (!encryptedString || !ivString) return null;
    
    const encrypted = base64ToArrayBuffer(encryptedString);
    const iv = base64ToArrayBuffer(ivString);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      cryptoKey!,
      encrypted
    );
    
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Token decryption failed:', error);
    
    // Clear invalid tokens if decryption fails
    if (error instanceof Error && error.name === 'OperationError') {
      localStorage.removeItem('encryptedToken');
      localStorage.removeItem('encryptionIV');
    }
    
    return null;
  }
}