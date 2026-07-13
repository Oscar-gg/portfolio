import { type GetStaticPaths, type GetStaticProps } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BlogLayout } from "~/components/Blog/BlogLayout";
import { Seo } from "~/components/Seo";
import { ArticleJsonLd } from "~/components/Blog/ArticleJsonLd";
import { ViewCounter } from "~/components/Blog/ViewCounter";
import {
  CommentSection,
  type CommentDTO,
} from "~/components/Blog/CommentSection";
import { db } from "~/server/db";
import { Eye } from "lucide-react";

interface PostProps {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  publishedAt: string;
  updatedAt: string;
  viewCount: number;
  authorName: string;
  comments: CommentDTO[];
}

export default function BlogPostPage({ post }: { post: PostProps }) {
  return (
    <BlogLayout>
      <Seo
        title={`${post.title} | Oscar Arreola`}
        description={post.excerpt ?? post.title}
        path={`/blog/${post.slug}`}
        image={post.coverImage ?? undefined}
        type="article"
        publishedAt={post.publishedAt}
      />
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt ?? post.title}
        slug={post.slug}
        image={post.coverImage}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        authorName={post.authorName}
      />
      <ViewCounter slug={post.slug} />

      <article className="mx-auto mb-16 mt-12 flex max-w-screen-xl flex-col px-10 lg:w-[80%]">
        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            className="mb-8 max-h-[420px] w-full rounded-lg object-cover"
          />
        )}

        <h1 className="mb-2 text-4xl font-bold text-secondary">
          {post.title}
        </h1>
        <div className="mb-8 flex items-center gap-4 text-sm text-quaternary">
          <span>{post.authorName}</span>
          <span>
            {new Date(post.publishedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" /> {post.viewCount}
          </span>
        </div>

        <div className="prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        <CommentSection postId={post.id} initialComments={post.comments} />
      </article>
    </BlogLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  });

  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug;
  if (typeof slug !== "string") return { notFound: true };

  const post = await db.blogPost.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { name: true, image: true } } },
      },
    },
  });

  if (!post || !post.published) return { notFound: true };

  return {
    props: {
      post: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        publishedAt: post.publishedAt?.toISOString() ?? post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        viewCount: post.viewCount,
        authorName: post.author.name ?? "Oscar Arreola",
        comments: post.comments.map((comment) => ({
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt.toISOString(),
          authorId: comment.authorId,
          parentId: comment.parentId,
          deleted: comment.deleted,
          author: comment.author,
        })),
      } satisfies PostProps,
    },
    revalidate: 60,
  };
};
