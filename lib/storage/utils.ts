import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

export async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    console.error('Failed to create data directory:', error)
  }
}

export async function readJsonFile<T>(filename: string): Promise<T[]> {
  try {
    await ensureDataDir()
    const filepath = path.join(DATA_DIR, filename)
    const content = await fs.readFile(filepath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }
    throw error
  }
}

export async function writeJsonFile<T>(filename: string, data: T[]): Promise<void> {
  try {
    await ensureDataDir()
    const filepath = path.join(DATA_DIR, filename)
    await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error(`Failed to write ${filename}:`, error)
    throw error
  }
}
