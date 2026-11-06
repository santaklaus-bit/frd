import type { CmsArticle } from "@/lib/cms/schema";
type Block = CmsArticle["blocks"][number];
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) =>
        block.type === "image" ? (
          <figure key={i}>
            <img
              src={block.url}
              alt={block.alt}
              style={{ width: "100%", borderRadius: 8 }}
            />
            {block.caption && (
              <figcaption style={{ fontSize: 12, marginTop: 8, opacity: 0.7 }}>
                {block.caption}
              </figcaption>
            )}
          </figure>
        ) : block.type === "heading" ? (
          <h2
            key={i}
            style={{ fontSize: 26, fontWeight: 600, margin: "24px 0 12px" }}
          >
            {block.text}
          </h2>
        ) : block.type === "quote" ? (
          <blockquote
            key={i}
            style={{
              borderLeft: "3px solid #ed6a3d",
              paddingLeft: 20,
              fontSize: 20,
              margin: "20px 0",
            }}
          >
            {block.text}
          </blockquote>
        ) : block.type === "list" ? (
          <ul
            key={i}
            style={{ listStyle: "disc", paddingLeft: 24, margin: "0 0 20px" }}
          >
            {block.text
              .split("\n")
              .filter(Boolean)
              .map((text, j) => (
                <li key={j}>{text}</li>
              ))}
          </ul>
        ) : (
          <p key={i} style={{ whiteSpace: "pre-line", marginBottom: 20 }}>
            {block.text}
          </p>
        ),
      )}
    </>
  );
}
