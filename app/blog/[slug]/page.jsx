import React from "react";
import BlogDetailPage from "../../../components/Blog";

export default async function Page({ params }) {
  const slug = (await params).slug;
  return <BlogDetailPage params={{ slug }} />;
}
