"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Category } from "@/lib/storage/category";
import { Product } from "@/lib/storage/product";
import { GalleryImage } from "@/lib/storage/gallery";
import { capitalize } from "@/lib/utils";
import Image from "next/image";
import { fetchArray } from "@/lib/client-data";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, productsData, galleryData] = await Promise.all([
          fetchArray<Category>("/api/categories"),
          fetchArray<Product>("/api/products"),
          fetchArray<GalleryImage>("/api/gallery"),
        ]);

        setCategories(categoriesData.slice(0, 3));
        setProducts(productsData.slice(0, 6));
        setGalleryImages(galleryData.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section
        className="relative text-white h-screen w-full flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url(/hero-background.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10 px-4">
          <h1 className="text-6xl md:text-7xl font-serif font-bold mb-6 text-balance">
            Phenomenal Art Gallery
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-light">
            Discover authentic Thangka masterpieces that embody centuries of
            spiritual artistry and Himalayan cultural heritage
          </p>
          <Link
            href="/products"
            className="inline-block px-10 py-4 rounded-lg hover:shadow-lg font-semibold transition-all duration-300 text-black"
            style={{ backgroundColor: "#040404", color: "#e1e1e1" }}
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="px-4 py-25 bg-white flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <Image
              src="/aboutimage.png"
              alt="About Phenomenal Art Gallery"
              height={1000}
              width={1000}
              className="w-full h-140 object-cover rounded-xl shadow-2xl"
            />
            <div>
              <h2
                className="text-4xl md:text-5xl font-serif font-bold mb-6"
                style={{ color: "#040404" }}
              >
                About Us
              </h2>
              <div
                className="w-24 h-1 mb-8"
                style={{ background: "#040404" }}
              ></div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Phenomenal Art Gallery is a sanctuary of authentic Himalayan
                  Thangka art, where centuries-old traditions are preserved and
                  reimagined under one roof. Each Thangka painting is
                  meticulously handcrafted, deeply rooted in the sacred
                  Himalayan style, and infused with spiritual symbolism and
                  artistic excellence.
                </p>
                <p>
                  Founded with a bold vision to make Thangka a meaningful part
                  of everyday living, Phenomenal Art Gallery transforms sacred
                  art into a lifestyle; one that inspires mindfulness, balance,
                  and inner harmony.
                </p>
                <p>
                  With a legacy spanning generations, the gallery proudly
                  carries forward a rich artistic heritage now led by the 4th
                  generation of master artists. Under the guidance of Master
                  Yuba Raj Tamang, a dedicated team of skilled artists and
                  artisans continues to create exceptional works that honor
                  tradition while embracing refined craftsmanship.
                </p>
                <p>
                  Guided by the philosophy of "Connecting Body, Mind & Speech,"
                  Phenomenal Art Gallery exists not merely to create art, but to
                  offer a profound spiritual and cultural experience through
                  every masterpiece.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section
        className="py-20 px-4 text-white text-center"
        style={{ background: "#040404" }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Discover Our Collection
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Explore our curated selection of authentic Thangka masterpieces
          </p>
          <Link
            href="/products"
            className="inline-block px-10 py-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
            style={{ backgroundColor: "#e1e1e1", color: "#040404" }}
          >
            Browse All Products
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 px-4" style={{ background: "#ffffff" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-serif font-bold mb-4"
              style={{ color: "#040404" }}
            >
              Featured Categories
            </h2>
            <div
              className="w-24 h-1 mx-auto"
              style={{ background: "#040404" }}
            ></div>
          </div>
          {loading ? (
            <p className="text-center text-gray-600">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-center text-gray-600">
              No categories available yet
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories?id=${category.id}`}
                  className="group cursor-pointer"
                >
                  <div className="relative h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    {category.imageUrl && (
                      <>
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 group-hover:via-black/40 transition-all duration-300"></div>
                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                          <h3 className="text-2xl font-serif font-bold mb-2 text-white transition-all duration-300 group-hover:translate-y-[-4px]">
                            {capitalize(category.name)}
                          </h3>
                          <p className="text-gray-200 text-sm leading-relaxed line-clamp-2 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                            {category.description}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-serif font-bold mb-4"
              style={{ color: "#040404" }}
            >
              Curated Masterpieces
            </h2>
            <div
              className="w-24 h-1 mx-auto"
              style={{ background: "#040404" }}
            ></div>
          </div>
          {loading ? (
            <p className="text-center text-gray-600">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-600">
              No products available yet
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group cursor-pointer"
                >
                  <div
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border"
                    style={{ borderColor: "#e8e3d8" }}
                  >
                    {product.imageUrl && (
                      <div
                        className="relative overflow-hidden h-80"
                        style={{ backgroundColor: "#fafaf7" }}
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                    <div className="p-8">
                      <h3
                        className="text-xl font-serif font-bold mb-3 transition-colors line-clamp-2"
                        style={{ color: "#040404" }}
                      >
                        {capitalize(product.name)}
                      </h3>
                      <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <p
                          className="text-3xl font-serif font-bold"
                          style={{ color: "#040404" }}
                        >
                          Rs. {product.price}
                        </p>
                        <div
                          style={{ color: "#040404" }}
                          className="group-hover:translate-x-2 transition-transform"
                        >
                          →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-16">
            <Link
              href="/products"
              className="inline-block text-white px-10 py-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: "#040404" }}
            >
              View All Masterpieces
            </Link>
          </div>
        </div>
      </section>

      {/* Mini Gallery Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-serif font-bold mb-4"
              style={{ color: "#040404" }}
            >
              Gallery
            </h2>
            <div
              className="w-24 h-1 mx-auto"
              style={{ background: "#040404" }}
            ></div>
          </div>
          {loading ? (
            <p className="text-center text-gray-600">Loading gallery...</p>
          ) : galleryImages.length === 0 ? (
            <p className="text-center text-gray-600">
              No images in the gallery yet
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {galleryImages.map((image) => (
                <Link
                  key={image.id}
                  href="/gallery"
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border">
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={image.imageUrl}
                        alt="Gallery image"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              href="/gallery"
              className="inline-block text-white px-10 py-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: "#040404" }}
            >
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
