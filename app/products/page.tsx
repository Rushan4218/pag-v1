"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Category } from "@/lib/storage/category";
import { Product } from "@/lib/storage/product";

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await fetch("/api/categories");
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const url = selectedCategory
        ? `/api/products?categoryId=${selectedCategory}`
        : "/api/products";
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <div className="flex-1 w-full">
        {/* Header */}
        <section
          className="text-white py-16 px-4"
          style={{ background: "#040404" }}
        >
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">
              Our Collection
            </h1>
            <p className="text-xl max-w-2xl font-light">
              Explore our carefully curated selection of authentic Thangka
              artworks
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto w-full px-4 py-16">
          {/* Category Filter */}
          <div className="mb-16">
            <h2
              className="text-2xl font-serif font-bold mb-6"
              style={{ color: "#040404" }}
            >
              Refine by Category
            </h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === ""
                    ? "text-white shadow-lg scale-105"
                    : "border"
                }`}
                style={{
                  backgroundColor:
                    selectedCategory === "" ? "#040404" : "transparent",
                  color: selectedCategory === "" ? "#ffffff" : "#040404",
                  borderColor:
                    selectedCategory === "" ? "transparent" : "#d0d0d0",
                }}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "text-white shadow-lg scale-105"
                      : "border"
                  }`}
                  style={{
                    backgroundColor:
                      selectedCategory === category.id
                        ? "#040404"
                        : "transparent",
                    color:
                      selectedCategory === category.id ? "#ffffff" : "#040404",
                    borderColor:
                      selectedCategory === category.id
                        ? "transparent"
                        : "#d0d0d0",
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <p className="text-center text-gray-600 py-12">
              Loading products...
            </p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-600 py-12">
              No products found in this category
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
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border h-full flex flex-col"
                    style={{ borderColor: "#d0d0d0" }}
                  >
                    {product.imageUrl && (
                      <div
                        className="relative overflow-hidden h-72"
                        style={{ backgroundColor: "#f5f5f5" }}
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                    <div className="p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <h3
                          className="text-xl font-serif font-bold mb-3 transition-colors line-clamp-2"
                          style={{ color: "#040404" }}
                        >
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {product.description}
                        </p>
                      </div>
                      <div
                        className="mt-6 pt-6 border-t flex justify-between items-center"
                        style={{ borderColor: "#d0d0d0" }}
                      >
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
        </div>
      </div>

      <Footer />
    </div>
  );
}
