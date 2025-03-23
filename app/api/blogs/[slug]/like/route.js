import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function POST(req, { params }) {
  try {
    await connectToDatabase();
    
    const { slug } = params; // ✅ Correct way to access dynamic params
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    blog.likes += 1; // Increment likes
    await blog.save();

    return NextResponse.json({ message: "Like added", likes: blog.likes });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
