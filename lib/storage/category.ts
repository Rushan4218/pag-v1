import connectDB from "@/lib/mongodb";
import CategoryModel from "@/lib/models/Category";
import mongoose from "mongoose";

console.log("connection", mongoose.connection.name);

export interface Category {
  _id?: string;
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export async function getAll(): Promise<Category[]> {
  await connectDB();

  console.log("dsb", mongoose.connection.db?.databaseName);
  const categories = await CategoryModel.find({}).sort({ createdAt: -1 });
  return categories.map((cat) => ({
    id: cat._id.toString(),
    name: cat.name,
    description: cat.description,
    imageUrl: cat.imageUrl,
    createdAt: cat.createdAt.toISOString(),
    updatedAt: cat.updatedAt.toISOString(),
  }));
}

export async function getById(id: string): Promise<Category | null> {
  await connectDB();
  const category = await CategoryModel.findById(id);
  if (!category) return null;
  return {
    id: category._id.toString(),
    name: category.name,
    description: category.description,
    imageUrl: category.imageUrl,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

export async function create(
  data: Omit<Category, "id" | "createdAt" | "updatedAt" | "_id">,
): Promise<Category> {
  await connectDB();

  const category = await CategoryModel.create(data);
  return {
    id: category._id.toString(),
    name: category.name,
    description: category.description,
    imageUrl: category.imageUrl,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

export async function update(
  id: string,
  data: Partial<Omit<Category, "id" | "createdAt" | "_id">>,
): Promise<Category> {
  await connectDB();
  const category = await CategoryModel.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!category) throw new Error(`Category ${id} not found`);
  return {
    id: category._id.toString(),
    name: category.name,
    description: category.description,
    imageUrl: category.imageUrl,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

export async function deleteCategory(id: string) {
  await connectDB();
  await CategoryModel.findByIdAndDelete(id);
}
