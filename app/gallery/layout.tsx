import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Explore the visual gallery of authentic Thangka masterpieces and spiritual art from Phenomenal Art Gallery.',
  alternates: {
    canonical: '/gallery',
  },
}

export default function GalleryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
