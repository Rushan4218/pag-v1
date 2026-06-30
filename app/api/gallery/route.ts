import { NextRequest, NextResponse } from 'next/server'
import * as galleryStorage from '@/lib/storage/gallery'

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
    const data = await request.json()
    const image = await galleryStorage.create(data)
    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error('Error creating gallery image:', error)
    return NextResponse.json({ error: 'Failed to create gallery image' }, { status: 500 })
  }
}
