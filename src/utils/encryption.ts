import { scrypt } from 'scrypt-js';

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || "change_this_key_in_env";
const SALT = "gateway_salt";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const ALGORITHM = "AES-GCM";

async function getKey(): Promise<CryptoKey> {
  const passwordBytes = new TextEncoder().encode(SECRET_KEY); // ✅ Fix here
  const saltBytes = new TextEncoder().encode(SALT);

  const derivedKey = await scrypt(
    passwordBytes,
    saltBytes,
    16384,
    8,
    1,
    32
  );

  return window.crypto.subtle.importKey(
    "raw",
    new Uint8Array(derivedKey),
    { name: ALGORITHM },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encrypt(payload: object): Promise<string> {
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await getKey();
  const json = JSON.stringify(payload);
  const encoder = new TextEncoder();
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoder.encode(json)
  );

  const fullCiphertext = new Uint8Array(ciphertextBuffer);
  const authTag = fullCiphertext.slice(fullCiphertext.length - AUTH_TAG_LENGTH);
  const encryptedData = fullCiphertext.slice(0, fullCiphertext.length - AUTH_TAG_LENGTH);

  const finalBuffer = new Uint8Array(IV_LENGTH + AUTH_TAG_LENGTH + encryptedData.length);
  finalBuffer.set(iv, 0);
  finalBuffer.set(authTag, IV_LENGTH);
  finalBuffer.set(encryptedData, IV_LENGTH + AUTH_TAG_LENGTH);

  return btoa(String.fromCharCode(...finalBuffer));
}

export async function decrypt(cipherText: string): Promise<any> {

  const buffer = Uint8Array.from(atob(cipherText), c => c.charCodeAt(0));
  const iv = buffer.slice(0, IV_LENGTH);
  const authTag = buffer.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encryptedData = buffer.slice(IV_LENGTH + AUTH_TAG_LENGTH);

  const fullCiphertext = new Uint8Array(encryptedData.length + AUTH_TAG_LENGTH);
  fullCiphertext.set(encryptedData, 0);
  fullCiphertext.set(authTag, encryptedData.length);

  const key = await getKey();
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    fullCiphertext
  );

  const decoder = new TextDecoder();
  const decodedText = decoder.decode(decryptedBuffer);

  try {
    const parsed = JSON.parse(decodedText);
    return parsed;
  } catch (e) {
    console.error('[Decryption JSON Parse Error]', e);
    throw new Error('Invalid JSON after decryption');
  }
}

