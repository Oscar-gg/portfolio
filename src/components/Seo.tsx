import Head from "next/head";
import { env } from "~/env";

export const Seo = ({
  title,
  description,
  path = "",
  image,
  type = "website",
  publishedAt,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedAt?: string;
}) => {
  const url = `${env.NEXT_PUBLIC_PROJECT_URL}${path}`;
  const ogImage = image ?? `${env.NEXT_PUBLIC_PROJECT_URL}/favicon.ico`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      {type === "article" && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
};
