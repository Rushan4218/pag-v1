'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Loader2, RotateCcw, X } from 'lucide-react'

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
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error: any) {
      setUploadError(error.message || 'Failed to save gallery image')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div>
        <label className="block text-sm font-medium text-zinc-800 mb-1.5">Image</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
        />
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
                setImagePreview('')
                setFormData((prev) => ({ ...prev, imageUrl: '' }))
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
          {loading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          {loading ? 'Uploading...' : 'Add to Gallery'}
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
