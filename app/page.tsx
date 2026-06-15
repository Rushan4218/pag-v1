"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Category } from "@/lib/storage/category";
import { Product } from "@/lib/storage/product";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/products"),
        ]);

        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();

        setCategories(categoriesData.slice(0, 3));
        setProducts(productsData.slice(0, 6));
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
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    {category.imageUrl && (
                      <div className="relative overflow-hidden h-72">
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                      </div>
                    )}
                    <div className="p-8">
                      <h3
                        className="text-2xl font-serif font-bold mb-3 transition-colors"
                        style={{ color: "#040404" }}
                      >
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {category.description}
                      </p>
                    </div>
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                    <div className="p-8">
                      <h3
                        className="text-xl font-serif font-bold mb-3 transition-colors line-clamp-2"
                        style={{ color: "#040404" }}
                      >
                        {product.name}
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

      <Footer />
    </div>
  );
}
