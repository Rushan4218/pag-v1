import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thangka Collection',
  description:
    'Browse the curated collection of authentic Himalayan Thangka artworks at Phenomenal Art Gallery.',
  alternates: {
    canonical: '/products',
  },
}

export default function ProductsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
