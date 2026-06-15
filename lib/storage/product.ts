import { readJsonFile, writeJsonFile } from './utils'
import { v4 as uuidv4 } from 'uuid'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  categoryId: string
  createdAt: string
  updatedAt: string
}

const FILENAME = 'products.json'

export async function getAll(): Promise<Product[]> {
  return readJsonFile<Product>(FILENAME)
}

export async function getById(id: string): Promise<Product | null> {
  const all = await getAll()
  return all.find((prod) => prod.id === id) || null
}

export async function getByCategoryId(categoryId: string): Promise<Product[]> {
  const all = await getAll()
  return all.filter((prod) => prod.categoryId === categoryId)
}

export async function create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const all = await getAll()
  const now = new Date().toISOString()
  const product: Product = {
    id: uuidv4(),
    ...data,
    createdAt: now,
    updatedAt: now,
  }
  all.push(product)
  await writeJsonFile(FILENAME, all)
  return product
}

export async function update(id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>) {
  const all = await getAll()
  const index = all.findIndex((prod) => prod.id === id)
  if (index === -1) throw new Error(`Product ${id} not found`)

  const now = new Date().toISOString()
  all[index] = {
    ...all[index],
    ...data,
    updatedAt: now,
  }
  await writeJsonFile(FILENAME, all)
  return all[index]
}

export async function deleteProduct(id: string) {
  const all = await getAll()
  const filtered = all.filter((prod) => prod.id !== id)
  await writeJsonFile(FILENAME, filtered)
}
