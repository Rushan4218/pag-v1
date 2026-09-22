import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const siteName = 'Phenomenal Art Gallery'
const siteUrl = 'https://pag-v1.vercel.app'
const siteDescription =
  'Explore authentic Himalayan Thangka paintings, spiritual masterpieces, and curated art collections from Phenomenal Art Gallery.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Authentic Himalayan Thangka Art`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  alternates: {
    canonical: '/',
  },
  keywords: [
    'Thangka art',
    'Himalayan art gallery',
    'Buddhist art',
    'spiritual paintings',
    'Phenomenal Art Gallery',
  ],
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName,
    title: `${siteName} | Authentic Himalayan Thangka Art`,
    description: siteDescription,
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: `${siteName} logo`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} | Authentic Himalayan Thangka Art`,
    description: siteDescription,
    images: ['/logo.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      description: siteDescription,
    },
    {
      '@type': 'ArtGallery',
      '@id': `${siteUrl}/#art-gallery`,
      name: siteName,
      url: siteUrl,
      image: `${siteUrl}/logo.png`,
      description: siteDescription,
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: siteName,
      url: siteUrl,
      description: siteDescription,
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
