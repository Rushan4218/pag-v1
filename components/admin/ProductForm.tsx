'use client'

import { useState, useEffect, useRef } from 'react'
import { ImagePlus, Loader2, RotateCcw, Save, X } from 'lucide-react'
import { Product } from '@/lib/storage/product'
import { Category } from '@/lib/storage/category'

interface ProductFormProps {
  product?: Product
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [imagePreview, setImagePreview] = useState<string>(product?.imageUrl || '')
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    categoryId: product?.categoryId || '',
    imageUrl: product?.imageUrl || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadError, setUploadError] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : [])
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    setFormData({
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      categoryId: product?.categoryId || '',
      imageUrl: product?.imageUrl || '',
    })
    setImagePreview(product?.imageUrl || '')
    setImageFile(null)
    setErrors({})
    setUploadError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [product])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError('')
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (event) => {
      const preview = event.target?.result as string
      setImagePreview(preview)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than 0'
    if (!formData.categoryId) newErrors.categoryId = 'Category is required'
    if (!product && !imageFile) newErrors.image = 'Image is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setErrors({})
    setLoading(true)
    setUploadError('')
    
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price.toString())
      formDataToSend.append('categoryId', formData.categoryId)
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }
      
      const res = await fetch(product ? `/api/products/${product.id}` : '/api/products', {
        method: product ? 'PUT' : 'POST',
        body: formDataToSend,
      })
      const data = await res.json()
      
      if (!res.ok) {
        setUploadError(data.error || 'Failed to save product')
        return
      }
      
      await onSubmit(data)
      if (!product) {
        setFormData({ name: '', description: '', price: 0, categoryId: '', imageUrl: '' })
        setImagePreview('')
        setImageFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    } catch (error: any) {
      setUploadError(error.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div>
        <label className="block text-sm font-medium text-zinc-800 mb-1.5">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 ${errors.name ? 'border-red-500' : 'border-zinc-300'}`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-800 mb-1.5">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 ${errors.description ? 'border-red-500' : 'border-zinc-300'}`}
          rows={3}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-800 mb-1.5">Price</label>
        <input
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 ${errors.price ? 'border-red-500' : 'border-zinc-300'}`}
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-800 mb-1.5">Category</label>
        <select
          value={formData.categoryId}
          onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 ${errors.categoryId ? 'border-red-500' : 'border-zinc-300'}`}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-800 mb-1.5">Image</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 ${errors.image ? 'border-red-500' : 'border-zinc-300'}`}
        />
        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
        {uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}
        {imagePreview && (
          <div className="mt-3 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 p-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-36 w-full object-cover rounded"
            />
            <button
              type="button"
              onClick={() => {
                setImagePreview(product?.imageUrl || '')
                setFormData((prev) => ({ ...prev, imageUrl: product?.imageUrl || '' }))
                setUploadError('')
                setImageFile(null)
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 hover:text-zinc-950"
            >
              <RotateCcw className="size-3.5" />
              Reset image
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : product ? <Save className="size-4" /> : <ImagePlus className="size-4" />}
          {loading ? 'Saving...' : product ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
        >
          <X className="size-4" />
          Cancel
        </button>
      </div>
    </form>
  )
}
