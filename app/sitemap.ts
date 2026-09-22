import type { MetadataRoute } from 'next'

const siteUrl = 'https://pag-v1.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  // Dynamic product/category URLs are not included here to avoid sitemap
  // generation depending on database connectivity at build/runtime.
  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/products`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/categories`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/gallery`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]
}
