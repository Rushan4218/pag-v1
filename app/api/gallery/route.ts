import { NextRequest, NextResponse } from 'next/server'
import * as galleryStorage from '@/lib/storage/gallery'
import { uploadImage } from '@/lib/cloudinary'

export async function GET() {
  try {
    const images = await galleryStorage.getAll()
    return NextResponse.json(images)
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract image file from FormData
    const imageFile = formData.get('image') as File | null
    
    // Validate image is provided
    if (!imageFile) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      )
    }
    
    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }
    
    // Validate file size
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }
    
    // Upload image to Cloudinary
    const buffer = Buffer.from(await imageFile.arrayBuffer())
    const uploadResult = await uploadImage(buffer, imageFile.name, 'phenomenal-art-gallery/gallery')
    
    // Create gallery image with Cloudinary URL
    const image = await galleryStorage.create({
      imageUrl: uploadResult.secure_url,
    })
    
    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error('Error creating gallery image:', error)
    return NextResponse.json({ error: 'Failed to create gallery image' }, { status: 500 })
  }
}
