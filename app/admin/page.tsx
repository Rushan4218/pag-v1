'use client'

import { useState, useEffect } from 'react'
import CategoryForm from '@/components/admin/CategoryForm'
import ProductForm from '@/components/admin/ProductForm'
import { Category } from '@/lib/storage/category'
import { Product } from '@/lib/storage/product'

type Section = 'categories' | 'products'

export default function AdminPage() {
  const [section, setSection] = useState<Section>('categories')
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (section === 'products') {
      fetchProducts()
    }
  }, [section])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async (data: any) => {
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setEditingCategory(null)
    fetchCategories()
  }

  const handleUpdateCategory = async (data: any) => {
    if (!editingCategory) return
    await fetch(`/api/categories/${editingCategory.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setEditingCategory(null)
    fetchCategories()
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure?')) {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      fetchCategories()
    }
  }

  const handleCreateProduct = async (data: any) => {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setEditingProduct(null)
    fetchProducts()
  }

  const handleUpdateProduct = async (data: any) => {
    if (!editingProduct) return
    await fetch(`/api/products/${editingProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setEditingProduct(null)
    fetchProducts()
  }

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure?')) {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      fetchProducts()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setSection('categories')}
            className={`px-4 py-2 rounded-md font-medium ${
              section === 'categories'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 border'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setSection('products')}
            className={`px-4 py-2 rounded-md font-medium ${
              section === 'products'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 border'
            }`}
          >
            Products
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {section === 'categories' && (
            <>
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {editingCategory ? 'Edit Category' : 'Create Category'}
                </h2>
                <CategoryForm
                  category={editingCategory || undefined}
                  onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
                  onCancel={() => setEditingCategory(null)}
                />
              </div>

              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Categories List</h2>
                {loading ? (
                  <p>Loading...</p>
                ) : categories.length === 0 ? (
                  <p className="text-gray-500">No categories yet</p>
                ) : (
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div key={category.id} className="flex gap-4 items-center p-4 bg-white rounded-lg border">
                        {category.imageUrl && (
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingCategory(category)}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {section === 'products' && (
            <>
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {editingProduct ? 'Edit Product' : 'Create Product'}
                </h2>
                <ProductForm
                  product={editingProduct || undefined}
                  onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
                  onCancel={() => setEditingProduct(null)}
                />
              </div>

              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Products List</h2>
                {loading ? (
                  <p>Loading...</p>
                ) : products.length === 0 ? (
                  <p className="text-gray-500">No products yet</p>
                ) : (
                  <div className="space-y-3">
                    {products.map((product) => (
                      <div key={product.id} className="flex gap-4 items-center p-4 bg-white rounded-lg border">
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.description}</p>
                          <p className="text-sm font-bold text-blue-600">${product.price}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
