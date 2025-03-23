import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { authOptions } from "../auth/[...nextauth]/route";

// Get all blogs (public)
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const tag = url.searchParams.get("tag");
    const featured = url.searchParams.get("featured");
    const limit = Number.parseInt(url.searchParams.get("limit") || "10");
    const page = Number.parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    await connectToDatabase();

    const query = { status: "published" };

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (featured === "true") {
      query.featured = true;
    }

    const totalBlogs = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-comments");

    return NextResponse.json(
      {
        success: true,
        blogs,
        pagination: {
          total: totalBlogs,
          page,
          limit,
          pages: Math.ceil(totalBlogs / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Blog fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching blogs" },
      { status: 500 }
    );
  }
}

// Create a new blog (admin only)
export async function POST(request) {
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
    console.log(blogData);
    // Add author information
    blogData.author = session.user.id;
    blogData.authorName = session.user.name;
    // add slug
    blogData.slug = blogData.title.toLowerCase().replace(/ /g, "-");

    const blog = await Blog.create(blogData);

    return NextResponse.json(
      {
        success: true,
        message: "Blog created successfully",
        blog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Blog creation error:", error);
    return NextResponse.json(
      { success: false, message: "Error creating blog" },
      { status: 500 }
    );
  }
}
