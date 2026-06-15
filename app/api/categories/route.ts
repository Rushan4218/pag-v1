import { NextRequest, NextResponse } from 'next/server'
import * as categoryStorage from '@/lib/storage/category'

export async function GET() {
  try {
    const categories = await categoryStorage.getAll()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const category = await categoryStorage.create(data)
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
