import { NextRequest, NextResponse } from 'next/server'
import * as categoryStorage from '@/lib/storage/category'
import { uploadImage } from '@/lib/cloudinary'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await categoryStorage.getById(id)
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const contentType = request.headers.get('content-type') || ''
    let data: Partial<Pick<categoryStorage.Category, 'name' | 'description' | 'imageUrl'>> = {}

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const name = formData.get('name')
      const description = formData.get('description')
      const imageFile = formData.get('image') as File | null

      if (typeof name === 'string') data.name = name
      if (typeof description === 'string') data.description = description

      if (imageFile && imageFile.size > 0) {
        if (!imageFile.type.startsWith('image/')) {
          return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
        }

        const maxSize = 10 * 1024 * 1024
        if (imageFile.size > maxSize) {
          return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 })
        }

        const buffer = Buffer.from(await imageFile.arrayBuffer())
        const uploadResult = await uploadImage(buffer, imageFile.name, 'phenomenal-art-gallery/categories')
        data.imageUrl = uploadResult.secure_url
      }
    } else {
      data = await request.json()
    }

    if (!data.name?.trim() || !data.description?.trim()) {
      return NextResponse.json({ error: 'Name and description are required' }, { status: 400 })
    }

    const updated = await categoryStorage.update(id, data)
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await categoryStorage.deleteCategory(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
