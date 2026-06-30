import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Verify configuration
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn('Cloudinary credentials not configured. Image uploads will fail.');
}

export interface UploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Upload an image buffer to Cloudinary
 * @param fileBuffer - The image file as a Buffer
 * @param fileName - Original filename (for extension detection)
 * @param folder - Cloudinary folder path (e.g., 'phenomenal-art-gallery/artworks')
 * @returns Promise with upload result containing secure_url
 */
export async function uploadImage(
  fileBuffer: Buffer,
  fileName: string,
  folder: string = 'phenomenal-art-gallery/artworks'
): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${fileBuffer.toString('base64')}`,
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      }
    );

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Delete an image from Cloudinary by public_id
 * @param publicId - Cloudinary public_id of the image
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

export default cloudinary;
