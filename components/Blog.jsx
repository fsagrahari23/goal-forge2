"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Tag,
  ChevronLeft,
  Bookmark,
  Loader2,
  Send,
} from "lucide-react";

export default function BlogDetailPage({ params }) {
  console.log(params);
  const router = useRouter();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [liking, setLiking] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/blogs/${params.slug}`);
        const data = await res.json();
        console.log(res);
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch blog");
        }
        console.log(data);
        setBlog(data.blog);

        // Fetch related blogs (same category)
        const relatedRes = await fetch(
          `/api/blogs?category=${data.blog.category}&limit=3`
        );
        const relatedData = await relatedRes.json();

        if (relatedRes.ok) {
          // Filter out the current blog
          setRelatedBlogs(
            relatedData.blogs.filter((b) => b._id !== data.blog._id).slice(0, 2)
          );
        }
      } catch (err) {
        setError("Failed to load blog");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params?.slug]);

  const handleLike = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setLiking(true);
      const res = await fetch(`/api/blogs/${params.slug}/like`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to like blog");
      }

      // Update blog with new like count
      setBlog((prev) => ({ ...prev, likes: data.likes }));
    } catch (err) {
      console.error("Error liking blog:", err);
    } finally {
      setLiking(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      router.push("/login");
      return;
    }

    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/blogs/${params.slug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: comment }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add comment");
      }

      // Update blog with new comment
      setBlog((prev) => ({
        ...prev,
        comments: [...prev.comments, data.comment],
      }));

      // Clear comment input
      setComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 py-12 md:px-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container px-4 py-12 md:px-6">
        <div className="rounded-lg border p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">Blog post not found</h3>
          <p className="mb-4 text-gray-500 dark:text-gray-400">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-500 py-16">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-10"></div>
        <div className="absolute -top-1/3 right-0 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-1/3 left-0 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>

        <div className="container relative px-4 md:px-6">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center text-white/80 hover:text-white"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Blog
          </Link>

          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  {blog.category}
                </Badge>
                <div className="text-sm text-white/80">
                  {new Date(blog.publishedAt).toLocaleDateString()}
                </div>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                {blog.title}
              </h1>
              <p className="mx-auto max-w-[700px] text-white/80 md:text-xl">
                {blog.excerpt}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarFallback>
                    {getInitials(blog.authorName)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="text-sm font-medium text-white">
                    {blog.authorName}
                  </div>
                  <div className="text-xs text-white/80">Author</div>
                </div>
              </div>
              <Separator orientation="vertical" className="h-8 bg-white/20" />
              <div className="flex items-center gap-4 text-white/80">
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
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{blog.readTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12 md:px-6">
        <div className="mx-auto max-w-4xl">
          {/* Cover Image */}
          {blog.coverImage && (
            <div className="mb-8 overflow-hidden rounded-lg">
              <img
                src={blog.coverImage || "/placeholder.svg"}
                alt={blog.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Blog Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <Link key={tag} href={`/blog?tag=${tag}`}>
                <Badge variant="outline" className="cursor-pointer">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleLike}
              disabled={liking}
            >
              {liking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className="h-4 w-4" />
              )}
              Like ({blog.likes})
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                navigator
                  .share({
                    title: blog.title,
                    text: blog.excerpt,
                    url: window.location.href,
                  })
                  .catch((err) => console.error("Error sharing:", err));
              }}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          <Separator className="my-8" />

          {/* Author Bio */}
          <div className="rounded-lg border bg-gray-50 p-6 dark:bg-gray-900">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback>{getInitials(blog.authorName)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{blog.authorName}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Content Creator at Goal Forge
                </p>
              </div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Expert in project management and productivity. Passionate about
              helping teams achieve their goals through effective planning and
              execution.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Comments Section */}
          <div>
            <h3 className="mb-6 text-2xl font-bold">
              Comments ({blog.comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <Textarea
                placeholder={user ? "Write a comment..." : "Login to comment"}
                className="mb-2 min-h-[100px]"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={!user || submitting}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!user || submitting || !comment.trim()}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Post Comment
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {blog.comments.length === 0 ? (
                <div className="rounded-lg border p-6 text-center">
                  <MessageSquare className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                  <h4 className="mb-1 text-lg font-medium">No comments yet</h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    Be the first to share your thoughts
                  </p>
                </div>
              ) : (
                blog.comments.map((comment, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {getInitials(comment.userName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{comment.userName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      {comment.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <div className="bg-gray-50 py-12 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <h2 className="mb-6 text-2xl font-bold">Related Posts</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {relatedBlogs.map((relatedBlog) => (
                <Link key={relatedBlog._id} href={`/blog/${relatedBlog.slug}`}>
                  <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                    <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {relatedBlog.coverImage ? (
                        <img
                          src={relatedBlog.coverImage || "/placeholder.svg"}
                          alt={relatedBlog.title}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                          <Bookmark className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        >
                          {relatedBlog.category}
                        </Badge>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(
                            relatedBlog.publishedAt
                          ).toLocaleDateString()}
                        </div>
                      </div>
                      <h3 className="line-clamp-2 mt-2 text-lg font-semibold">
                        {relatedBlog.title}
                      </h3>
                      <p className="line-clamp-2 mt-1 text-gray-500 dark:text-gray-400">
                        {relatedBlog.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
