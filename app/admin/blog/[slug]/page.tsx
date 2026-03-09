import { getBlogPost } from "@/lib/content-manager";
import { BlogForm } from "@/components/admin/blog-form";
import { notFound } from "next/navigation";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const post = await getBlogPost(slug);
    if (!post) {
      return notFound();
    }

    const initialData = {
      slug: post.slug,
      title: post.title,
      description: post.description || "",
      date: post.date,
      thumbnail: post.thumbnail || "",
      content: post.content,
    };

    return <BlogForm initialData={initialData} />;
  } catch (err) {
    notFound();
  }
}
