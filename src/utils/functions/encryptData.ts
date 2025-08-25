import Cookies from 'js-cookie';

export const generateKey = async (): Promise<CryptoKey> => {
    const key = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true, // Key is extractable (for storage)
      ["encrypt", "decrypt"]
    );
     // Export the key and store it in localStorage
     const exportedKey = await crypto.subtle.exportKey("raw", key);
     const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
     Cookies.set("encryptionKey", keyBase64);
    return key;
  };
  
  // Retrieve the stored key or generate a new one
  export const getKey = async (): Promise<CryptoKey> => {
    const storedKey = `${import.meta.env.VITE_ENCRYPTED_KEY}`;
    if (!storedKey) return generateKey(); 
    
    const keyBuffer = Uint8Array.from(atob(`${import.meta.env.VITE_ENCRYPTED_KEY}`), (c) => c.charCodeAt(0)).buffer;
    return crypto.subtle.importKey("raw", keyBuffer, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
  };
  
  // Convert text to an ArrayBuffer
  const textToArrayBuffer = (text: string): ArrayBuffer => new TextEncoder().encode(text);
  
  // Convert an ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => 
    btoa(String.fromCharCode(...new Uint8Array(buffer)));
  
  // Convert a Base64 string to an ArrayBuffer
  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = atob(base64);
    return Uint8Array.from(binaryString, (c) => c.charCodeAt(0)).buffer;
  };
  
  // Encrypt function
  export const encryptText = async (text: string): Promise<string> => {
    const key = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Generate a random IV From the buffer
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      textToArrayBuffer(text)
    );
  
    return `${arrayBufferToBase64(iv)}:${arrayBufferToBase64(encrypted)}`;
  };
  
  // Decrypt function
  export const decryptText = async (cipherText: string): Promise<string> => {
    const key = await getKey();
    const [ivBase64, encryptedBase64] = cipherText.split(":");
    if (!ivBase64 || !encryptedBase64) throw new Error("Invalid encrypted text format");
  
    const iv = base64ToArrayBuffer(ivBase64);
    const encrypted = base64ToArrayBuffer(encryptedBase64);
  
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv) },
      key,
      encrypted
    );
  
    return new TextDecoder().decode(decrypted);
  };
  