import { NextRequest, NextResponse } from 'next/server'
import * as productStorage from '@/lib/storage/product'
import { uploadImage } from '@/lib/cloudinary'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('categoryId')

    let products
    if (categoryId) {
      products = await productStorage.getByCategoryId(categoryId)
    } else {
      products = await productStorage.getAll()
    }
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract fields from FormData
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const categoryId = formData.get('categoryId') as string
    const imageFile = formData.get('image') as File | null
    
    // Validate required fields
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Name, description, price, and category are required' },
        { status: 400 }
      )
    }
    
    // Validate price
    const parsedPrice = parseFloat(price)
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      )
    }
    
    let imageUrl = ''
    
    // Upload image to Cloudinary if provided
    if (imageFile) {
      if (!imageFile.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'File must be an image' },
          { status: 400 }
        )
      }
      
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (imageFile.size > maxSize) {
        return NextResponse.json(
          { error: 'File size must be less than 10MB' },
          { status: 400 }
        )
      }
      
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const uploadResult = await uploadImage(buffer, imageFile.name, 'phenomenal-art-gallery/artworks')
      imageUrl = uploadResult.secure_url
    }
    
    // Create product with image URL
    const product = await productStorage.create({
      name,
      description,
      price: parsedPrice,
      categoryId,
      imageUrl,
    })
    
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
