import { notFound } from "next/navigation";
import { getBlogById } from "@/lib/api";
import BlogDetailClient from "@/components/modules/blog/BlogDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) notFound();

  return <BlogDetailClient blog={blog} />;
}