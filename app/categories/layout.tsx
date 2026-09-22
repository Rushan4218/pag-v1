import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Art Categories',
  description:
    'Explore Thangka art collections by category, tradition, and theme at Phenomenal Art Gallery.',
  alternates: {
    canonical: '/categories',
  },
}

export default function CategoriesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
