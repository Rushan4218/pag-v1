"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/public/logo.png";

export default function Navigation() {
  const pathname = usePathname();

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
          <div className="flex gap-8">
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
          </div>
        </div>
      </div>
    </nav>
  );
}
