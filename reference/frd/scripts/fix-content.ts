import { Initiative, Production } from "../lib/db/models";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

async function fix() {
  console.log("Starting data fix...");

  // Fix Initiatives (Expertise)
  const initiatives = await Initiative.findAll();
  for (const item of initiatives) {
    if (!item.slug || item.slug.trim() === "") {
      const baseSlug = slugify(item.titleFr || "expertise");
      const timestamp = Date.now().toString().slice(-4);
      item.slug = `${baseSlug}-${timestamp}`;
      await item.save();
      console.log(`Assigned slug "${item.slug}" to Initiative ID ${item.id}`);
    }
  }

  // Fix Productions (Projects)
  const productions = await Production.findAll();
  for (const item of productions) {
    if (!item.slug || item.slug.trim() === "") {
      const baseSlug = slugify(item.titleFr || "project");
      const timestamp = Date.now().toString().slice(-4);
      item.slug = `${baseSlug}-${timestamp}`;
      await item.save();
      console.log(`Assigned slug "${item.slug}" to Production ID ${item.id}`);
    }
    
    // Fix broken image path if it's Just a filename
    if (item.image && !item.image.startsWith("/") && !item.image.startsWith("http")) {
       item.image = `/uploads/${item.image}`;
       await item.save();
       console.log(`Fixed image path for Production ID ${item.id}: ${item.image}`);
    }
  }

  console.log("Data fix complete.");
  process.exit(0);
}

fix();
