import Link from "next/link";
import { type GetStaticProps } from "next";
import { BlogLayout } from "~/components/Blog/BlogLayout";
import { Seo } from "~/components/Seo";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";
import { api } from "~/utils/api";
import { Eye, MessageCircle } from "lucide-react";

interface BlogListItem {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string;
  viewCount: number;
  commentCount: number;
}

export default function BlogIndexPage({ posts }: { posts: BlogListItem[] }) {
  const { data: isAdmin } = api.blog.isAdmin.useQuery();

  return (
    <BlogLayout>
      <Seo
        title="Blog | Oscar Arreola"
        description="Technical writing on software engineering, projects, and things I'm learning."
        path="/blog"
      />
      <div className="mx-auto mb-16 mt-12 flex max-w-screen-xl flex-col px-10 lg:w-[80%]">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-secondary">Blog</h1>
          {isAdmin && (
            <div className="flex gap-2">
              <Link href="/blog/media">
                <Button type="button" variant="secondary">
                  Manage media
                </Button>
              </Link>
              <Link href="/blog/new">
                <Button type="button">New post</Button>
              </Link>
            </div>
          )}
        </div>

        {posts.length === 0 && (
          <p className="text-quaternary">No posts published yet.</p>
        )}

        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-lg border border-gray-700 p-6 transition-colors hover:border-palette-blue"
            >
              <h2 className="text-2xl font-semibold text-secondary">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-2 text-quaternary">{post.excerpt}</p>
              )}
              <div className="mt-4 flex items-center gap-4 text-sm text-quaternary">
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
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" /> {post.commentCount}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </BlogLayout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
      viewCount: true,
      _count: { select: { comments: true } },
    },
  });

  return {
    props: {
      posts: posts.map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        publishedAt: post.publishedAt?.toISOString() ?? "",
        viewCount: post.viewCount,
        commentCount: post._count.comments,
      })),
    },
    revalidate: 60,
  };
};
