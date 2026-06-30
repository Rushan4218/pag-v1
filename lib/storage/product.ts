import connectDB from '@/lib/mongodb';
import ProductModel from '@/lib/models/Product';

export interface Product {
  _id?: string;
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export async function getAll(): Promise<Product[]> {
  await connectDB();
  const products = await ProductModel.find({}).sort({ createdAt: -1 });
  return products.map((prod) => ({
    id: prod._id.toString(),
    name: prod.name,
    description: prod.description,
    price: prod.price,
    imageUrl: prod.imageUrl,
    categoryId: prod.categoryId,
    createdAt: prod.createdAt.toISOString(),
    updatedAt: prod.updatedAt.toISOString(),
  }));
}

export async function getById(id: string): Promise<Product | null> {
  await connectDB();
  const product = await ProductModel.findById(id);
  if (!product) return null;
  return {
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    categoryId: product.categoryId,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export async function getByCategoryId(categoryId: string): Promise<Product[]> {
  await connectDB();
  const products = await ProductModel.find({ categoryId }).sort({ createdAt: -1 });
  return products.map((prod) => ({
    id: prod._id.toString(),
    name: prod.name,
    description: prod.description,
    price: prod.price,
    imageUrl: prod.imageUrl,
    categoryId: prod.categoryId,
    createdAt: prod.createdAt.toISOString(),
    updatedAt: prod.updatedAt.toISOString(),
  }));
}

export async function create(
  data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | '_id'>,
): Promise<Product> {
  await connectDB();
  const product = await ProductModel.create(data);
  return {
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    categoryId: product.categoryId,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export async function update(
  id: string,
  data: Partial<Omit<Product, 'id' | 'createdAt' | '_id'>>,
): Promise<Product> {
  await connectDB();
  const product = await ProductModel.findByIdAndUpdate(id, data, { new: true });
  if (!product) throw new Error(`Product ${id} not found`);
  return {
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    categoryId: product.categoryId,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export async function deleteProduct(id: string) {
  await connectDB();
  await ProductModel.findByIdAndDelete(id);
}
