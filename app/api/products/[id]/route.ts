import { NextRequest, NextResponse } from 'next/server'
import * as productStorage from '@/lib/storage/product'
import { uploadImage } from '@/lib/cloudinary'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await productStorage.getById(id)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const contentType = request.headers.get('content-type') || ''
    let data: Partial<Pick<productStorage.Product, 'name' | 'description' | 'price' | 'categoryId' | 'imageUrl'>> = {}

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const name = formData.get('name')
      const description = formData.get('description')
      const price = formData.get('price')
      const categoryId = formData.get('categoryId')
      const imageFile = formData.get('image') as File | null

      if (typeof name === 'string') data.name = name
      if (typeof description === 'string') data.description = description
      if (typeof categoryId === 'string') data.categoryId = categoryId
      if (typeof price === 'string') data.price = parseFloat(price)

      if (imageFile && imageFile.size > 0) {
        if (!imageFile.type.startsWith('image/')) {
          return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
        }

        const maxSize = 10 * 1024 * 1024
        if (imageFile.size > maxSize) {
          return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 })
        }

        const buffer = Buffer.from(await imageFile.arrayBuffer())
        const uploadResult = await uploadImage(buffer, imageFile.name, 'phenomenal-art-gallery/artworks')
        data.imageUrl = uploadResult.secure_url
      }
    } else {
      data = await request.json()
    }

    if (!data.name?.trim() || !data.description?.trim() || !data.categoryId?.trim()) {
      return NextResponse.json(
        { error: 'Name, description, price, and category are required' },
        { status: 400 }
      )
    }

    if (typeof data.price !== 'number' || Number.isNaN(data.price) || data.price <= 0) {
      return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 })
    }

    const updated = await productStorage.update(id, data)
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await productStorage.deleteProduct(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
