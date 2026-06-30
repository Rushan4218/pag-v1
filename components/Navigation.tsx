"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import logo from "@/public/logo.png";

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const getLinkStyle = (href: string) => {
    if (isActive(href)) {
      return {
        color: "#040404",
        borderBottom: "2px solid #040404",
        paddingBottom: "2px",
      };
    }
    return {
      color: "#666666",
    };
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="h-20">
            <Image
              alt="PAG LOGO"
              src={logo}
              className="h-full w-auto object-contain"
              height={200}
              width={200}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8">
            <Link
              href="/"
              className="font-medium transition-colors"
              style={getLinkStyle("/")}
              onMouseEnter={(e) =>
                !isActive("/") && (e.currentTarget.style.color = "#333333")
              }
              onMouseLeave={(e) =>
                !isActive("/") && (e.currentTarget.style.color = "#666666")
              }
            >
              Home
            </Link>
            <Link
              href="/products"
              className="font-medium transition-colors"
              style={getLinkStyle("/products")}
              onMouseEnter={(e) =>
                !isActive("/products") &&
                (e.currentTarget.style.color = "#333333")
              }
              onMouseLeave={(e) =>
                !isActive("/products") &&
                (e.currentTarget.style.color = "#666666")
              }
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="font-medium transition-colors"
              style={getLinkStyle("/categories")}
              onMouseEnter={(e) =>
                !isActive("/categories") &&
                (e.currentTarget.style.color = "#333333")
              }
              onMouseLeave={(e) =>
                !isActive("/categories") &&
                (e.currentTarget.style.color = "#666666")
              }
            >
              Categories
            </Link>
            <Link
              href="/gallery"
              className="font-medium transition-colors"
              style={getLinkStyle("/gallery")}
              onMouseEnter={(e) =>
                !isActive("/gallery") &&
                (e.currentTarget.style.color = "#333333")
              }
              onMouseLeave={(e) =>
                !isActive("/gallery") &&
                (e.currentTarget.style.color = "#666666")
              }
            >
              Gallery
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Menu content */}
            <div
              className="absolute backdrop-blur-sm inset-0 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(false);
              }}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col gap-6">
                  <Link
                    href="/"
                    className="font-medium text-2xl transition-colors text-center py-3"
                    style={getLinkStyle("/")}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/products"
                    className="font-medium text-2xl transition-colors text-center py-3"
                    style={getLinkStyle("/products")}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Products
                  </Link>
                  <Link
                    href="/categories"
                    className="font-medium text-2xl transition-colors text-center py-3"
                    style={getLinkStyle("/categories")}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Categories
                  </Link>
                  <Link
                    href="/gallery"
                    className="font-medium text-2xl transition-colors text-center py-3"
                    style={getLinkStyle("/gallery")}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Gallery
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
