'use client'

import { useState } from 'react'

interface GalleryFormProps {
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}

export default function GalleryForm({ onSubmit, onCancel }: GalleryFormProps) {
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [formData, setFormData] = useState({
    imageUrl: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadError, setUploadError] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)

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
    
    if (!imageFile) {
      setUploadError('Image is required')
      return
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setErrors({})
    setLoading(true)
    setUploadError('')
    
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('image', imageFile)
      
      const res = await fetch('/api/gallery', { method: 'POST', body: formDataToSend })
      const data = await res.json()
      
      if (!res.ok) {
        setUploadError(data.error || 'Failed to save gallery image')
        return
      }
      
      await onSubmit(data)
      setFormData({ imageUrl: '' })
      setImagePreview('')
      setImageFile(null)
    } catch (error: any) {
      setUploadError(error.message || 'Failed to save gallery image')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg border">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => {
                setImagePreview('')
                setFormData((prev) => ({ ...prev, imageUrl: '' }))
                setUploadError('')
                setImageFile(null)
              }}
              className="mt-2 text-sm text-red-600 hover:text-red-700"
            >
              Remove image
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Add to Gallery'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
