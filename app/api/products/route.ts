import { NextRequest, NextResponse } from 'next/server'
import * as productStorage from '@/lib/storage/product'

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
    const data = await request.json()
    const product = await productStorage.create(data)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
