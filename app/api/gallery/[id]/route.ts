import { NextRequest, NextResponse } from 'next/server'
import * as galleryStorage from '@/lib/storage/gallery'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const image = await galleryStorage.getById(id)
    if (!image) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 })
    }
    return NextResponse.json(image)
  } catch (error) {
    console.error('Error fetching gallery image:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery image' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await galleryStorage.deleteGalleryImage(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting gallery image:', error)
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 })
  }
}
