'use client'

import { useEffect, useMemo, useState } from 'react'
import { FolderOpen, ImageIcon, Loader2, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react'
import CategoryForm from '@/components/admin/CategoryForm'
import ProductForm from '@/components/admin/ProductForm'
import GalleryForm from '@/components/admin/GalleryForm'
import { Category } from '@/lib/storage/category'
import { Product } from '@/lib/storage/product'
import { GalleryImage } from '@/lib/storage/gallery'

type Section = 'categories' | 'products' | 'gallery'

const sections: Array<{ id: Section; label: string; icon: typeof FolderOpen }> = [
  { id: 'categories', label: 'Categories', icon: FolderOpen },
  { id: 'products', label: 'Products', icon: Plus },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
]

async function readApi<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  const data = await res.json()

  if (!res.ok || data?.error) {
    throw new Error(data?.error || 'Request failed')
  }

  return data
}

export default function AdminPage() {
  const [section, setSection] = useState<Section>('categories')
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const activeCount = useMemo(() => {
    if (section === 'categories') return categories.length
    if (section === 'products') return products.length
    return galleryImages.length
  }, [categories.length, galleryImages.length, products.length, section])

  const categoryNameById = useMemo(() => {
    return new Map(categories.map((category) => [category.id, category.name]))
  }, [categories])

  useEffect(() => {
    void fetchCategories()
  }, [])

  useEffect(() => {
    setError('')
    setEditingCategory(null)
    setEditingProduct(null)

    if (section === 'categories') {
      void fetchCategories()
    }
    if (section === 'products') {
      void fetchProducts()
      if (categories.length === 0) void fetchCategories(false)
    }
    if (section === 'gallery') {
      void fetchGalleryImages()
    }
  }, [section])

  const fetchCategories = async (showLoader = true) => {
    if (showLoader) setLoading(true)
    try {
      setCategories(await readApi<Category[]>('/api/categories'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories')
      setCategories([])
    } finally {
      if (showLoader) setLoading(false)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      setProducts(await readApi<Product[]>('/api/products'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const fetchGalleryImages = async () => {
    setLoading(true)
    try {
      setGalleryImages(await readApi<GalleryImage[]>('/api/gallery'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch gallery images')
      setGalleryImages([])
    } finally {
      setLoading(false)
    }
  }

  const refreshActiveSection = async () => {
    setError('')
    if (section === 'categories') await fetchCategories()
    if (section === 'products') await fetchProducts()
    if (section === 'gallery') await fetchGalleryImages()
  }

  const handleCategorySaved = async () => {
    setEditingCategory(null)
    await fetchCategories()
  }

  const handleProductSaved = async () => {
    setEditingProduct(null)
    await fetchProducts()
  }

  const handleGalleryImageSaved = async () => {
    await fetchGalleryImages()
  }

  const deleteItem = async (url: string, id: string, refresh: () => Promise<void>) => {
    if (!confirm('Delete this item permanently?')) return

    setActionLoadingId(id)
    setError('')
    try {
      await readApi(url, { method: 'DELETE' })
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">Phenomenal Art Gallery</p>
            <h1 className="mt-1 text-3xl font-bold text-zinc-950">Admin Dashboard</h1>
          </div>
          <button
            onClick={refreshActiveSection}
            disabled={loading}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 disabled:opacity-50"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            Refresh
          </button>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {sections.map((item) => {
            const Icon = item.icon
            const count =
              item.id === 'categories'
                ? categories.length
                : item.id === 'products'
                  ? products.length
                  : galleryImages.length

            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex items-center justify-between rounded-lg border p-4 text-left transition ${
                  section === item.id
                    ? 'border-zinc-950 bg-zinc-950 text-white shadow-sm'
                    : 'border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="size-5" />
                  <span className="font-semibold">{item.label}</span>
                </span>
                <span className={`rounded-md px-2 py-1 text-sm ${section === item.id ? 'bg-white/15' : 'bg-zinc-100'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <main className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-950">
                {section === 'categories' && (editingCategory ? 'Edit Category' : 'Create Category')}
                {section === 'products' && (editingProduct ? 'Edit Product' : 'Create Product')}
                {section === 'gallery' && 'Add Gallery Image'}
              </h2>
            </div>

            {section === 'categories' && (
              <CategoryForm
                category={editingCategory || undefined}
                onSubmit={handleCategorySaved}
                onCancel={() => setEditingCategory(null)}
              />
            )}

            {section === 'products' && (
              <ProductForm
                product={editingProduct || undefined}
                onSubmit={handleProductSaved}
                onCancel={() => setEditingProduct(null)}
              />
            )}

            {section === 'gallery' && <GalleryForm onSubmit={handleGalleryImageSaved} onCancel={() => {}} />}
          </aside>

          <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-zinc-950">
                  {section === 'categories' && 'Categories'}
                  {section === 'products' && 'Products'}
                  {section === 'gallery' && 'Gallery'}
                </h2>
                <p className="text-sm text-zinc-500">{activeCount} items</p>
              </div>
              {loading && <Loader2 className="size-5 animate-spin text-zinc-500" />}
            </div>

            <div className="p-5">
              {section === 'categories' && (
                <ListState
                  loading={loading}
                  empty={categories.length === 0}
                  emptyText="No categories yet"
                >
                  <div className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
                    {categories.map((category) => (
                      <div key={category.id} className="flex flex-col gap-4 bg-white p-4 sm:flex-row sm:items-center">
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="h-20 w-full rounded-md object-cover sm:w-24"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-zinc-950">{category.name}</h3>
                          <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{category.description}</p>
                        </div>
                        <RowActions
                          loading={actionLoadingId === category.id}
                          onEdit={() => setEditingCategory(category)}
                          onDelete={() => deleteItem(`/api/categories/${category.id}`, category.id, fetchCategories)}
                        />
                      </div>
                    ))}
                  </div>
                </ListState>
              )}

              {section === 'products' && (
                <ListState loading={loading} empty={products.length === 0} emptyText="No products yet">
                  <div className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
                    {products.map((product) => (
                      <div key={product.id} className="flex flex-col gap-4 bg-white p-4 sm:flex-row sm:items-center">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-20 w-full rounded-md object-cover sm:w-24"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-zinc-950">{product.name}</h3>
                            <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
                              {categoryNameById.get(product.categoryId) || 'Uncategorized'}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{product.description}</p>
                          <p className="mt-2 text-sm font-bold text-zinc-950">Rs. {product.price}</p>
                        </div>
                        <RowActions
                          loading={actionLoadingId === product.id}
                          onEdit={() => setEditingProduct(product)}
                          onDelete={() => deleteItem(`/api/products/${product.id}`, product.id, fetchProducts)}
                        />
                      </div>
                    ))}
                  </div>
                </ListState>
              )}

              {section === 'gallery' && (
                <ListState loading={loading} empty={galleryImages.length === 0} emptyText="No images yet">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {galleryImages.map((image) => (
                      <div key={image.id} className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                        <img src={image.imageUrl} alt="Gallery image" className="h-56 w-full object-cover" />
                        <button
                          onClick={() => deleteItem(`/api/gallery/${image.id}`, image.id, fetchGalleryImages)}
                          disabled={actionLoadingId === image.id}
                          className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-md bg-white text-red-600 shadow-sm transition hover:bg-red-50 disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                          aria-label="Delete image"
                          title="Delete image"
                        >
                          {actionLoadingId === image.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </ListState>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

function ListState({
  loading,
  empty,
  emptyText,
  children,
}: {
  loading: boolean
  empty: boolean
  emptyText: string
  children: React.ReactNode
}) {
  if (loading) {
    return (
      <div className="flex min-h-44 items-center justify-center text-sm font-medium text-zinc-500">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Loading...
      </div>
    )
  }

  if (empty) {
    return (
      <div className="flex min-h-44 items-center justify-center rounded-lg border border-dashed border-zinc-300 text-sm font-medium text-zinc-500">
        {emptyText}
      </div>
    )
  }

  return children
}

function RowActions({
  loading,
  onEdit,
  onDelete,
}: {
  loading: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex shrink-0 gap-2">
      <button
        onClick={onEdit}
        className="inline-flex size-8 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-700 transition hover:bg-zinc-100"
        aria-label="Edit item"
        title="Edit item"
      >
        <Pencil className="size-4" />
      </button>
      <button
        onClick={onDelete}
        disabled={loading}
        className="inline-flex size-8 items-center justify-center rounded-md bg-red-50 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
        aria-label="Delete item"
        title="Delete item"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      </button>
    </div>
  )
}
