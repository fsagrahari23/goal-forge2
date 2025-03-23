"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Clock,
  Eye,
  Heart,
  MessageSquare,
  Search,
  Tag,
  Bookmark,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function BlogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    pages: 1,
  });

  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const page = Number.parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);

        // Fetch featured blogs
        const featuredRes = await fetch(`/api/blogs?featured=true&limit=3`);
        const featuredData = await featuredRes.json();

        if (!featuredRes.ok) {
          throw new Error(
            featuredData.message || "Failed to fetch featured blogs"
          );
        }

        setFeaturedBlogs(featuredData.blogs);

        // Fetch regular blogs with filters
        let url = `/api/blogs?page=${page}&limit=${pagination.limit}`;
        if (category) url += `&category=${category}`;
        if (tag) url += `&tag=${tag}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch blogs");
        }

        setBlogs(data.blogs);
        setPagination(data.pagination);

        // Extract unique categories and tags
        const allCategories = new Set();
        const allTags = new Set();

        data.blogs.forEach((blog) => {
          allCategories.add(blog.category);
          blog.tags.forEach((tag) => allTags.add(tag));
        });

        setCategories(Array.from(allCategories));
        setTags(Array.from(allTags));
      } catch (err) {
        setError("Failed to load blogs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [category, tag, page, pagination.limit]);

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, you would implement search functionality
    console.log("Searching for:", searchTerm);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;

    let url = `/blog?page=${newPage}`;
    if (category) url += `&category=${category}`;
    if (tag) url += `&tag=${tag}`;

    router.push(url);
  };

  // Filter blogs based on search term (client-side filtering)
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-500 py-16">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-10"></div>
        <div className="absolute -top-1/3 right-0 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-1/3 left-0 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>

        <div className="container relative px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                Goal Forge Blog
              </h1>
              <p className="mx-auto max-w-[700px] text-white/80 md:text-xl">
                Insights, tips, and updates to help you plan better projects and
                achieve your goals
              </p>
            </div>
            <div className="w-full max-w-md">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  className="w-full bg-white/10 pl-8 text-white placeholder:text-white/50 focus:bg-white/20 border-white/10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12 md:px-6">
        {/* Featured Posts */}
        {featuredBlogs.length > 0 && (
          <div className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Featured Posts</h2>
              <Link href="/blog?featured=true">
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {featuredBlogs.map((blog) => (
                <Link key={blog._id} href={`/blog/${blog.slug}`}>
                  <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                    <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {blog.coverImage ? (
                        <img
                          src={blog.coverImage || "/placeholder.svg"}
                          alt={blog.title}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-r from-purple-500/20 to-blue-500/20">
                          <Bookmark className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <CardHeader className="p-4">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                        >
                          {blog.category}
                        </Badge>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(blog.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <CardTitle className="line-clamp-2 mt-2 text-xl">
                        {blog.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {blog.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex items-center justify-between p-4 pt-0 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{blog.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{blog.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{blog.comments?.length}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{blog.readTime} min read</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid gap-10 md:grid-cols-4">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-lg font-semibold">Categories</h3>
                <div className="space-y-2">
                  <Link href="/blog">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        !category ? "bg-gray-100 dark:bg-gray-800" : ""
                      }`}
                    >
                      All Categories
                    </Button>
                  </Link>
                  {categories.map((cat) => (
                    <Link key={cat} href={`/blog?category=${cat}`}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${
                          category === cat ? "bg-gray-100 dark:bg-gray-800" : ""
                        }`}
                      >
                        {cat}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <Link key={t} href={`/blog?tag=${t}`}>
                      <Badge
                        variant={tag === t ? "default" : "outline"}
                        className="cursor-pointer"
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        {t}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Blog Posts */}
          <div className="md:col-span-3">
            <Tabs defaultValue="latest">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="latest">Latest</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                </TabsList>
                {category && (
                  <div className="flex items-center gap-2">
                    <span>Filtered by:</span>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                      {category}
                      <button
                        className="ml-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 p-0.5"
                        onClick={() => router.push("/blog")}
                      >
                        ×
                      </button>
                    </Badge>
                  </div>
                )}
              </div>

              <TabsContent value="latest" className="mt-6">
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : filteredBlogs.length === 0 ? (
                  <div className="rounded-lg border p-8 text-center">
                    <h3 className="mb-2 text-xl font-semibold">
                      No blog posts found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm
                        ? "Try a different search term"
                        : "Check back soon for new content"}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {filteredBlogs.map((blog) => (
                      <Link key={blog._id} href={`/blog/${blog.slug}`}>
                        <Card className="h-full overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px]">
                          <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                            {blog.coverImage ? (
                              <img
                                src={blog.coverImage || "/placeholder.svg"}
                                alt={blog.title}
                                className="h-full w-full object-cover transition-transform hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                                <Bookmark className="h-10 w-10 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <CardHeader className="p-4">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                              >
                                {blog.category}
                              </Badge>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(
                                  blog.publishedAt
                                ).toLocaleDateString()}
                              </div>
                            </div>
                            <CardTitle className="line-clamp-2 mt-2">
                              {blog.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                              {blog.excerpt}
                            </CardDescription>
                          </CardHeader>
                          <CardFooter className="flex items-center justify-between p-4 pt-0 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{blog.views}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                <span>{blog.likes}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{blog.readTime} min read</span>
                            </div>
                          </CardFooter>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    {Array.from(
                      { length: pagination.pages },
                      (_, i) => i + 1
                    ).map((p) => (
                      <Button
                        key={p}
                        variant={p === pagination.page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="popular" className="mt-6">
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Sort by views for popular tab */}
                    {[...filteredBlogs]
                      .sort((a, b) => b.views - a.views)
                      .map((blog) => (
                        <Link key={blog._id} href={`/blog/${blog.slug}`}>
                          <Card className="h-full overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px]">
                            <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                              {blog.coverImage ? (
                                <img
                                  src={blog.coverImage || "/placeholder.svg"}
                                  alt={blog.title}
                                  className="h-full w-full object-cover transition-transform hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                                  <Bookmark className="h-10 w-10 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <CardHeader className="p-4">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                                >
                                  {blog.category}
                                </Badge>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(
                                    blog.publishedAt
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                              <CardTitle className="line-clamp-2 mt-2">
                                {blog.title}
                              </CardTitle>
                              <CardDescription className="line-clamp-2">
                                {blog.excerpt}
                              </CardDescription>
                            </CardHeader>
                            <CardFooter className="flex items-center justify-between p-4 pt-0 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  <span>{blog.views}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="h-4 w-4" />
                                  <span>{blog.likes}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{blog.readTime} min read</span>
                              </div>
                            </CardFooter>
                          </Card>
                        </Link>
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
