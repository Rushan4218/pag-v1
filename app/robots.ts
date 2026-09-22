import type { MetadataRoute } from 'next'

const siteUrl = 'https://pag-v1.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
