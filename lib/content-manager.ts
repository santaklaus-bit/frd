import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const BLOG_PATH = path.join(process.cwd(), "blog/content");
const DICT_PATH = path.join(process.cwd(), "dictionaries");
const DATA_PATH = path.join(process.cwd(), "lib/data");

export async function getBlogPosts() {
  const files = await fs.readdir(BLOG_PATH);
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const filePath = path.join(BLOG_PATH, file);
        const content = await fs.readFile(filePath, "utf-8");
        const { data } = matter(content);
        return {
          slug: file.replace(".mdx", ""),
          title: data.title,
          date: data.date,
          description: data.description,
          thumbnail: data.thumbnail,
        };
      })
  );
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function saveBlogPost(slug: string, frontmatter: any, content: string) {
  const filePath = path.join(BLOG_PATH, `${slug}.mdx`);
  const fileContent = matter.stringify(content, frontmatter);
  await fs.writeFile(filePath, fileContent, "utf-8");
}

export async function deleteBlogPost(slug: string) {
  const filePath = path.join(BLOG_PATH, `${slug}.mdx`);
  await fs.unlink(filePath);
}

export async function getDictionary(lang: "en" | "fr") {
  const filePath = path.join(DICT_PATH, `${lang}.json`);
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content);
}

export async function saveDictionary(lang: "en" | "fr", data: any) {
  const filePath = path.join(DICT_PATH, `${lang}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function getData(filename: string) {
  const filePath = path.join(DATA_PATH, `${filename}.json`);
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content);
}

export async function saveData(filename: string, data: any) {
  const filePath = path.join(DATA_PATH, `${filename}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}
