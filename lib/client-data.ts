export async function fetchArray<T>(url: string): Promise<T[]> {
  const res = await fetch(url)
  const data = await res.json()

  if (!res.ok || !Array.isArray(data)) {
    return []
  }

  return data
}
