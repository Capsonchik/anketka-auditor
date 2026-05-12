const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'v-66-super-secret-key-32-chars-long!!'
const ALGORITHM = 'AES-CBC'

async function getKey() {
  const enc = new TextEncoder()
  let keyData = enc.encode(ENCRYPTION_KEY)
  
  // AES-CBC требует ключ длиной 16, 24 или 32 байта
  if (keyData.length < 32) {
    const newKey = new Uint8Array(32)
    newKey.set(keyData)
    keyData = newKey
  } else if (keyData.length > 32) {
    keyData = keyData.slice(0, 32)
  }

  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: ALGORITHM },
    false,
    ['encrypt', 'decrypt']
  )
}
export async function encrypt(text: string): Promise<string> {
  try {
    const iv = crypto.getRandomValues(new Uint8Array(16))
    const enc = new TextEncoder()
    const key = await getKey()
    
    const encrypted = await crypto.subtle.encrypt(
      { name: ALGORITHM, iv },
      key,
      enc.encode(text)
    )

    const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('')
    const encryptedHex = Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join('')
    
    return `${ivHex}:${encryptedHex}`
  } catch (e) {
    console.error('[Crypto] Encryption failed:', e)
    throw e
  }
}

export async function decrypt(text: string): Promise<string> {
  const [ivHex, encryptedHex] = text.split(':')
  
  const iv = new Uint8Array(ivHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
  const encrypted = new Uint8Array(encryptedHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
  
  const key = await getKey()
  
  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    encrypted
  )
  
  return new TextDecoder().decode(decrypted)
}

/**
 * Расшифровка payload из заголовка middleware (формат encrypt → JSON).
 * Не импортирует `next/headers` — передайте сырое значение заголовка.
 */
export async function parseEncryptedJsonPayload<T>(raw: string | null): Promise<T | null> {
  if (!raw) return null
  try {
    const decrypted = await decrypt(raw)
    return JSON.parse(decrypted) as T
  } catch {
    return null
  }
}
