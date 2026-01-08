export async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder()
  const data = enc.encode(input)
  const buf = await crypto.subtle.digest('SHA-256', data)
  const bytes = Array.from(new Uint8Array(buf))
  return bytes.map(b => b.toString(16).padStart(2, '0')).join('')
}

export function diagKey(brand: string, category: string, region: string): string {
  return `${String(brand).toLowerCase().trim()}|${String(category).toLowerCase().trim()}|${String(region).toLowerCase().trim()}`
}

export async function diagHash(brand: string, category: string, region: string): Promise<string> {
  return await sha256Hex(diagKey(brand, category, region))
}

