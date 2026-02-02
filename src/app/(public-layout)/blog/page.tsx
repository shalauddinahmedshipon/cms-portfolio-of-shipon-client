// app/blog/page.tsx
import BlogsClient from "@/components/modules/blog/BlogsClient";

export const metadata = {
  title: "Blog",
  description: "Articles, tutorials, news and thoughts about programming, technology and more",
};

export default function BlogPage() {
  return <BlogsClient />;
}