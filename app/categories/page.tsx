'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Category } from '@/lib/storage/category'
import { Product } from '@/lib/storage/product'

function CategoriesContent() {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('id')

  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        setCategories(data)

        if (categoryId) {
          const selected = data.find((cat: Category) => cat.id === categoryId)
          if (selected) {
            setSelectedCategory(selected)
          }
        } else if (data.length > 0) {
          setSelectedCategory(data[0])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [categoryId])

  useEffect(() => {
    if (!selectedCategory) return

    const fetchProducts = async () => {
      const res = await fetch(`/api/products?categoryId=${selectedCategory.id}`)
      const data = await res.json()
      setProducts(data)
    }

    fetchProducts()
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <div className="flex-1 w-full">
        {/* Header */}
        <section className="text-white py-16 px-4" style={{ background: '#040404' }}>
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">Explore Categories</h1>
            <p className="text-xl max-w-2xl font-light">
              Browse our art collections organized by theme and tradition
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto w-full px-4 py-16">
          {loading ? (
            <p className="text-center text-gray-600">Loading categories...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Categories Sidebar */}
              <div>
                <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: '#040404' }}>Collections</h2>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-6 py-4 rounded-lg font-medium transition-all duration-300 border`}
                      style={{
                        backgroundColor: selectedCategory?.id === category.id ? '#040404' : 'transparent',
                        color: selectedCategory?.id === category.id ? '#ffffff' : '#040404',
                        borderColor: selectedCategory?.id === category.id ? 'transparent' : '#d0d0d0',
                        boxShadow: selectedCategory?.id === category.id ? '0 10px 15px -3px rgba(4, 4, 4, 0.2)' : 'none'
                      }}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Category & Products */}
              <div className="lg:col-span-3">
                {selectedCategory ? (
                  <>
                    {selectedCategory.imageUrl && (
                      <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                        <img
                          src={selectedCategory.imageUrl}
                          alt={selectedCategory.name}
                          className="w-full h-96 object-cover"
                        />
                      </div>
                    )}

                    <div className="mb-12 pb-8 border-b" style={{ borderColor: '#d0d0d0' }}>
                      <h2 className="text-4xl font-serif font-bold mb-4" style={{ color: '#040404' }}>
                        {selectedCategory.name}
                      </h2>
                      <p className="text-gray-700 text-lg leading-relaxed">{selectedCategory.description}</p>
                    </div>

                    <h3 className="text-3xl font-serif font-bold mb-8" style={{ color: '#040404' }}>Artworks in this Collection</h3>
                    {products.length === 0 ? (
                      <p className="text-gray-600 py-12">No artworks in this collection yet</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {products.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="group cursor-pointer"
                          >
                            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border h-full flex flex-col" style={{ borderColor: '#d0d0d0' }}>
                              {product.imageUrl && (
                                <div className="relative overflow-hidden h-72" style={{ backgroundColor: '#f5f5f5' }}>
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                              )}
                              <div className="p-8 flex-1 flex flex-col justify-between">
                                <div>
                                  <h4 className="text-xl font-serif font-bold mb-3 transition-colors line-clamp-2" style={{ color: '#040404' }}>
                                    {product.name}
                                  </h4>
                                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                    {product.description}
                                  </p>
                                </div>
                                <div className="mt-6 pt-6 border-t flex justify-between items-center" style={{ borderColor: '#d0d0d0' }}>
                                  <p className="text-3xl font-serif font-bold" style={{ color: '#040404' }}>
                                    ₹{product.price}
                                  </p>
                                  <div style={{ color: '#d4af37' }} className="group-hover:translate-x-2 transition-transform">
                                    →
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-600">Select a collection to view artworks</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoriesContent />
    </Suspense>
  )
}
