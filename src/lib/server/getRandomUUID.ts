export function getRandomUUID() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 6);
} 

export function getShortRandomId(length = 6) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(36).padStart(2, '0')).join('').slice(0, length).toUpperCase();
}
