import { type GetServerSideProps } from "next";
import { env } from "~/env";
import { db } from "~/server/db";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const BlogRss = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = env.NEXT_PUBLIC_PROJECT_URL;

  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      publishedAt: true,
    },
  });

  const items = posts
    .map((post) => {
      const url = `${baseUrl}/blog/${post.slug}`;
      return `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${url}</link>
    <guid>${url}</guid>
    <pubDate>${(post.publishedAt ?? new Date()).toUTCString()}</pubDate>
    ${post.excerpt ? `<description>${escapeXml(post.excerpt)}</description>` : ""}
  </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Oscar Arreola's Blog</title>
  <link>${baseUrl}/blog</link>
  <description>Technical writing on software engineering, projects, and things I'm learning.</description>
${items}
</channel>
</rss>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default BlogRss;
