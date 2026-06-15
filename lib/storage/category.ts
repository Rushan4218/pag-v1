import { readJsonFile, writeJsonFile } from "./utils";
import { v4 as uuidv4 } from "uuid";

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

const FILENAME = "categories.json";

export async function getAll(): Promise<Category[]> {
  return readJsonFile<Category>(FILENAME);
}

export async function getById(id: string): Promise<Category | null> {
  const all = await getAll();
  return all.find((cat) => cat.id === id) || null;
}

export async function create(
  data: Omit<Category, "id" | "createdAt" | "updatedAt">,
): Promise<Category> {
  const all = await getAll();
  const now = new Date().toISOString();
  const category: Category = {
    id: uuidv4(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  all.push(category);
  await writeJsonFile(FILENAME, all);
  return category;
}

export async function update(
  id: string,
  data: Partial<Omit<Category, "id" | "createdAt">>,
) {
  const all = await getAll();
  const index = all.findIndex((cat) => cat.id === id);
  if (index === -1) throw new Error(`Category ${id} not found`);

  const now = new Date().toISOString();
  all[index] = {
    ...all[index],
    ...data,
    updatedAt: now,
  };
  await writeJsonFile(FILENAME, all);
  return all[index];
}

export async function deleteCategory(id: string) {
  const all = await getAll();
  const filtered = all.filter((cat) => cat.id !== id);
  await writeJsonFile(FILENAME, filtered);
}
