import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { BlogForm } from "@/components/admin/blog-form";
import { notFound } from "next/navigation";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "blog/content", `${slug}.mdx`);

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    const initialData = {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      thumbnail: data.thumbnail || "",
      content: content,
    };

    return <BlogForm initialData={initialData} />;
  } catch (err) {
    notFound();
  }
}
