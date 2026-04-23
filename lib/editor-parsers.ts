export const customParsers = {
  image: (block: any) => {
    // Enhanced URL extraction with multiple fallbacks
    const data = block.data;
    const url =
      data.file?.url ||
      data.url ||
      (typeof data.file === "string" ? data.file : null);

    if (!url) {
      console.warn("Editor.js Image block missing URL:", block);
      return "";
    }

    const caption = data.caption || "";
    const alt = caption || "Image";

    return `
      <figure class="my-10 space-y-4">
        <div class="relative rounded-3xl overflow-hidden border border-border/40 shadow-2xl group bg-muted/30">
          <img 
            src="${url}" 
            alt="${alt}" 
            loading="lazy"
            style="display: block; width: 100%; height: auto; max-height: 800px; object-fit: contain;"
            class="transition-transform duration-700 group-hover:scale-105"
            onerror="this.style.display='none'; console.error('Failed to load image:', '${url}')"
          />
        </div>
        ${
          caption
            ? `
          <figcaption class="text-sm text-muted-foreground italic px-4 border-l-2 border-primary/30 py-1 max-w-3xl mx-auto">
            ${caption}
          </figcaption>
        `
            : ""
        }
      </figure>
    `;
  },
  "simple-image": (block: any) => {
    const data = block.data;
    const url = data.url || data.file?.url;

    if (!url) return "";

    const caption = data.caption || "";
    return `
      <figure class="my-10">
        <div class="rounded-3xl overflow-hidden border border-border/40 shadow-2xl group">
          <img src="${url}" alt="${caption}" style="width: 100%; height: auto; display: block;" class="transition-transform duration-700 group-hover:scale-105" />
        </div>
        ${caption ? `<figcaption class="text-sm text-muted-foreground italic mt-4 px-4 border-l-2 border-primary/30">${caption}</figcaption>` : ""}
      </figure>
    `;
  },
  list: (block: any) => {
    const { style, items } = block.data;
    const type = style === "ordered" ? "ol" : "ul";
    const listClass = style === "ordered" ? "list-decimal" : "list-disc";

    const listItems = items.map((item: string) => `<li>${item}</li>`).join("");
    return `<${type} class="${listClass} ml-6 space-y-2 my-6">${listItems}</${type}>`;
  },
  header: (block: any) => {
    const { text, level } = block.data;
    return `<h${level} class="font-bold tracking-tight uppercase mt-12 mb-6">${text}</h${level}>`;
  },
  paragraph: (block: any) => {
    const { text } = block.data;
    return `<p class="leading-relaxed text-muted-foreground/90 my-6 text-lg font-medium">${text}</p>`;
  },
  quote: (block: any) => {
    const { text, caption, alignment } = block.data;
    return `
      <blockquote class="border-l-4 border-primary bg-primary/5 py-8 px-10 rounded-r-3xl italic my-10 relative">
        <p class="text-xl text-foreground font-medium mb-4">"${text}"</p>
        ${caption ? `<cite class="text-sm font-bold uppercase tracking-widest text-primary not-italic">— ${caption}</cite>` : ""}
      </blockquote>
    `;
  },
  delimiter: () => {
    return `<div class="flex items-center justify-center gap-2 my-16 text-muted-foreground/30">
      <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
      <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
      <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
    </div>`;
  },
};
