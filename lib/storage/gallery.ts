import connectDB from '@/lib/mongodb';
import GalleryImageModel from '@/lib/models/GalleryImage';

export interface GalleryImage {
  _id?: string;
  id: string;
  imageUrl: string;
  createdAt: string;
}

export async function getAll(): Promise<GalleryImage[]> {
  await connectDB();
  const images = await GalleryImageModel.find({}).sort({ createdAt: -1 });
  return images.map((img) => ({
    id: img._id.toString(),
    imageUrl: img.imageUrl,
    createdAt: img.createdAt.toISOString(),
  }));
}

export async function getById(id: string): Promise<GalleryImage | null> {
  await connectDB();
  const image = await GalleryImageModel.findById(id);
  if (!image) return null;
  return {
    id: image._id.toString(),
    imageUrl: image.imageUrl,
    createdAt: image.createdAt.toISOString(),
  };
}

export async function create(
  data: Omit<GalleryImage, 'id' | 'createdAt' | '_id'>,
): Promise<GalleryImage> {
  await connectDB();
  const image = await GalleryImageModel.create(data);
  return {
    id: image._id.toString(),
    imageUrl: image.imageUrl,
    createdAt: image.createdAt.toISOString(),
  };
}

export async function deleteGalleryImage(id: string) {
  await connectDB();
  await GalleryImageModel.findByIdAndDelete(id);
}
