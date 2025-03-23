import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { authOptions } from "../../../auth/[...nextauth]/route";

// Add a comment to a blog (authenticated users only)
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const { content } = await request.json();

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Comment content is required" },
        { status: 400 }
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

    // Add comment
    blog.comments.push({
      userId: session.user.id,
      userName: session.user.name,
      content,
    });

    await blog.save();

    return NextResponse.json(
      {
        success: true,
        message: "Comment added successfully",
        comment: blog.comments[blog.comments.length - 1],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Comment creation error:", error);
    return NextResponse.json(
      { success: false, message: "Error adding comment" },
      { status: 500 }
    );
  }
}
