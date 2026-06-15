'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Product } from '@/lib/storage/product'
import { Category } from '@/lib/storage/category'

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [paramId, setParamId] = useState<string>('')

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setParamId(resolvedParams.id)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (!paramId) return

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${paramId}`)
        if (!res.ok) throw new Error('Product not found')
        const data = await res.json()
        setProduct(data)

        // Fetch category
        const categoryRes = await fetch(`/api/categories/${data.categoryId}`)
        if (categoryRes.ok) {
          const categoryData = await categoryRes.json()
          setCategory(categoryData)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [paramId])

  const handleWhatsApp = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '1234567890'
    const text = `Hi, I'm interested in purchasing: ${product?.name}. Could you please provide more details?`
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
    
    if (window.self !== window.top) {
      window.open(url, '_blank')
    } else {
      window.open(url, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Product not found</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <div className="flex-1 w-full">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto w-full px-4 py-6">
          <Link href="/products" className="font-medium transition-colors" style={{ color: '#040404' }}>
            ← Back to Collection
          </Link>
        </div>

        <div className="max-w-7xl mx-auto w-full px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Image */}
            <div>
              {product.imageUrl && (
                <div className="rounded-xl overflow-hidden shadow-2xl sticky top-24" style={{ backgroundColor: '#f5f5f5' }}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col justify-start">
              <h1 className="text-5xl font-serif font-bold mb-4" style={{ color: '#040404' }}>
                {product.name}
              </h1>
              
              {category && (
                <Link
                  href={`/categories?id=${category.id}`}
                  className="font-semibold mb-6 transition-colors"
                  style={{ color: '#040404' }}
                >
                  {category.name}
                </Link>
              )}
              
              <div className="flex items-center gap-2 mb-8">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: '#040404' }}>★</span>
                  ))}
                </div>
                <span className="text-gray-600">(Authentic Thangka Art)</span>
              </div>

              <div className="pb-8 mb-8" style={{ borderColor: '#d0d0d0', borderBottom: '1px solid #d0d0d0' }}>
                <p className="text-4xl font-serif font-bold mb-6" style={{ color: '#040404' }}>
                  Rs. {product.price}
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-4 mt-12">
                <button
                  onClick={handleWhatsApp}
                  className="w-full text-white py-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 text-lg"
                  style={{ backgroundColor: '#22c55e' }}
                >
                  <span>💬</span>
                  Contact via WhatsApp
                </button>
              </div>

              {/* Features */}
              <div className="mt-12 pt-12" style={{ borderColor: '#d0d0d0', borderTop: '1px solid #d0d0d0' }}>
                <h3 className="text-xl font-serif font-bold mb-6" style={{ color: '#040404' }}>Why Choose This Artwork</h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex gap-4">
                    <span className="font-bold text-xl" style={{ color: '#040404' }}>✓</span>
                    <span>Handpainted by master Thangka artists</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="font-bold text-xl" style={{ color: '#040404' }}>✓</span>
                    <span>Uses traditional pigments and authentic materials</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="font-bold text-xl" style={{ color: '#040404' }}>✓</span>
                    <span>Certificate of authenticity included</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="font-bold text-xl" style={{ color: '#040404' }}>✓</span>
                    <span>Perfect investment for art collectors</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
