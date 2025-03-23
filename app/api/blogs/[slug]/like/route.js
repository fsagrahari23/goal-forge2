import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { authOptions } from "../../../auth/[...nextauth]/route";

// Like a blog (authenticated users only)
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const blog = await Blog.findOne({ slug: params.slug });

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    // Increment likes
    blog.likes += 1;
    await blog.save();

    return NextResponse.json(
      {
        success: true,
        message: "Blog liked successfully",
        likes: blog.likes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Blog like error:", error);
    return NextResponse.json(
      { success: false, message: "Error liking blog" },
      { status: 500 }
    );
  }
}
