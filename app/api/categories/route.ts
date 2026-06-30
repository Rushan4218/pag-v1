import { NextRequest, NextResponse } from "next/server";
import * as categoryStorage from "@/lib/storage/category";
import { uploadImage } from "@/lib/cloudinary";

export async function GET() {
  try {
    const categories = await categoryStorage.getAll();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract fields from FormData
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File | null;
    
    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }
    
    let imageUrl = "";
    
    // Upload image to Cloudinary if provided
    if (imageFile) {
      if (!imageFile.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "File must be an image" },
          { status: 400 }
        );
      }
      
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (imageFile.size > maxSize) {
        return NextResponse.json(
          { error: "File size must be less than 10MB" },
          { status: 400 }
        );
      }
      
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadResult = await uploadImage(buffer, imageFile.name, "phenomenal-art-gallery/categories");
      imageUrl = uploadResult.secure_url;
    }
    
    // Create category with image URL
    const category = await categoryStorage.create({
      name,
      description,
      imageUrl,
    });
    
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
