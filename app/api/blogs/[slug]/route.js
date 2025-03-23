import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { authOptions } from "../../../../config/authOptions";


// Get a single blog by slug (public)
export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const blog = await Blog.findOne({
      slug: (await params).slug,
      status: "published",
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    return NextResponse.json(
      {
        success: true,
        blog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Blog fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching blog" },
      { status: 500 }
    );
  }
}

// Update a blog (admin only)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    const blogData = await request.json();

    await connectToDatabase();

    const blog = await Blog.findOne({ slug: (await params).slug });

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    // Update blog fields
    Object.keys(blogData).forEach((key) => {
      if (
        key !== "_id" &&
        key !== "author" &&
        key !== "authorName" &&
        key !== "slug"
      ) {
        blog[key] = blogData[key];
      }
    });

    await blog.save();

    return NextResponse.json(
      {
        success: true,
        message: "Blog updated successfully",
        blog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Blog update error:", error);
    return NextResponse.json(
      { success: false, message: "Error updating blog" },
      { status: 500 }
    );
  }
}

// Delete a blog (admin only)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const blog = await Blog.findOneAndDelete({ slug: params.slug });

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Blog deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Blog deletion error:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting blog" },
      { status: 500 }
    );
  }
}
