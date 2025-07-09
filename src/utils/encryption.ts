// Encryption utility for browser (Vite/React compatible)
// Uses scrypt-js and Web Crypto API (crypto.subtle)
import { scrypt } from 'scrypt-js';

// Config (same as admin)
const SECRET_KEY = "3caeb58290002e75c08f0fea4c3a4260c93e8c37218b994ccb2eb78455ce87e5";
const SALT = "gateway_salt";
const IV_LENGTH = 12; // AES-GCM recommended IV length
const AUTH_TAG_LENGTH = 16; // AES-GCM auth tag length
const ALGORITHM = "AES-GCM";

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

// Derive the AES key using scrypt-js
async function getKey(): Promise<CryptoKey> {
  const passwordBytes = hexToBytes(SECRET_KEY);
  const saltBytes = new TextEncoder().encode(SALT);
  // scrypt parameters must match Node.js defaults:
  // N = 16384, r = 8, p = 1
  const derivedKey = await scrypt(
    passwordBytes,
    saltBytes,
    16384,
    8,
    1,
    32 // output key length in bytes
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
    {
      name: ALGORITHM,
      iv: iv
    },
    key,
    encoder.encode(json)
  );
  // Web Crypto appends auth tag to ciphertext.
  const fullCiphertext = new Uint8Array(ciphertextBuffer);
  const authTag = fullCiphertext.slice(fullCiphertext.length - AUTH_TAG_LENGTH);
  const encryptedData = fullCiphertext.slice(0, fullCiphertext.length - AUTH_TAG_LENGTH);
  // [IV][AuthTag][Ciphertext]
  const finalBuffer = new Uint8Array(IV_LENGTH + AUTH_TAG_LENGTH + encryptedData.length);
  finalBuffer.set(iv, 0);
  finalBuffer.set(authTag, IV_LENGTH);
  finalBuffer.set(encryptedData, IV_LENGTH + AUTH_TAG_LENGTH);
  return btoa(String.fromCharCode(...finalBuffer));
}

export async function decrypt(cipherText: string): Promise<any> {
  const buffer = Uint8Array.from(atob(cipherText), (c) => c.charCodeAt(0));
  const iv = buffer.slice(0, IV_LENGTH);
  const authTag = buffer.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encryptedData = buffer.slice(IV_LENGTH + AUTH_TAG_LENGTH);
  // Web Crypto expects auth tag at the end of ciphertext
  const fullCiphertext = new Uint8Array(encryptedData.length + AUTH_TAG_LENGTH);
  fullCiphertext.set(encryptedData, 0);
  fullCiphertext.set(authTag, encryptedData.length);
  const key = await getKey();
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv: iv
    },
    key,
    fullCiphertext
  );
  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(decryptedBuffer));
}
