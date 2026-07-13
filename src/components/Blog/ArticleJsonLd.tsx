import { env } from "~/env";

export const ArticleJsonLd = ({
  title,
  description,
  slug,
  image,
  publishedAt,
  updatedAt,
  authorName,
}: {
  title: string;
  description: string;
  slug: string;
  image?: string | null;
  publishedAt: string;
  updatedAt: string;
  authorName: string;
}) => {
  const url = `${env.NEXT_PUBLIC_PROJECT_URL}/blog/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: image ? [image] : undefined,
    datePublished: publishedAt,
    dateModified: updatedAt,
    author: { "@type": "Person", name: authorName },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};
