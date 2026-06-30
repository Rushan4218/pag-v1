"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { GalleryImage } from "@/lib/storage/gallery";

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        setImages(data);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      {/* Gallery Header */}
      <section className="py-24 px-4" style={{ background: "#ffffff" }}>
        <div className="max-w-7xl mx-auto text-center">
          <h1
            className="text-4xl md:text-5xl font-serif font-bold mb-4"
            style={{ color: "#040404" }}
          >
            Gallery
          </h1>
          <div
            className="w-24 h-1 mx-auto"
            style={{ background: "#040404" }}
          ></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Explore our collection of authentic Thangka masterpieces and spiritual art
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <p className="text-center text-gray-600">Loading gallery...</p>
          ) : images.length === 0 ? (
            <p className="text-center text-gray-600">
              No images in the gallery yet
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border"
                  style={{ borderColor: "#e8e3d8" }}
                >
                  <div className="relative overflow-hidden h-80">
                    <img
                      src={image.imageUrl}
                      alt="Gallery image"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
