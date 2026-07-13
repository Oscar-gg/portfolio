import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { getServerAuthSession } from "~/server/auth";
import { env } from "~/env";
import { BlogLayout } from "~/components/Blog/BlogLayout";
import { MediaPicker } from "~/components/Blog/MediaPicker";
import { PostPreview } from "~/components/Blog/PostPreview";
import { Seo } from "~/components/Seo";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button, buttonVariants } from "~/components/ui/button";
import { api } from "~/utils/api";
import { cn } from "~/utils/utils";

export default function NewBlogPostPage() {
  const router = useRouter();
  const editId =
    typeof router.query.id === "string" ? router.query.id : undefined;

  const { data: existingPosts } = api.blog.listAll.useQuery();
  const existing = existingPosts?.find((post) => post.id === editId);
  const { data: session } = useSession();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [published, setPublished] = useState(false);

  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [mediaPickerTarget, setMediaPickerTarget] = useState<
    "cover" | "content" | null
  >(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!existing) return;
    setTitle(existing.title);
    setExcerpt(existing.excerpt ?? "");
    setContent(existing.content);
    setCoverImage(existing.coverImage ?? "");
    setPublished(existing.published);
  }, [existing]);

  const utils = api.useContext();

  const create = api.blog.create.useMutation({
    onSuccess: async (post) => {
      await utils.blog.listAll.invalidate();
      await router.push(`/blog/${post.slug}`);
    },
  });

  const update = api.blog.update.useMutation({
    onSuccess: async (post) => {
      await utils.blog.listAll.invalidate();
      await router.push(`/blog/${post.slug}`);
    },
  });

  const remove = api.blog.delete.useMutation({
    onSuccess: async () => {
      await utils.blog.listAll.invalidate();
      await router.push("/blog/new");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = { title, excerpt, content, coverImage, published };
    if (existing) {
      update.mutate({ id: existing.id, ...input });
    } else {
      create.mutate(input);
    }
  };

  const isSaving = create.isLoading || update.isLoading;

  const handleMediaSelect = (url: string) => {
    if (mediaPickerTarget === "cover") {
      setCoverImage(url);
    } else if (mediaPickerTarget === "content") {
      const markdown = `![](${url})`;
      const textarea = contentRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const next = content.slice(0, start) + markdown + content.slice(end);
        setContent(next);
        requestAnimationFrame(() => {
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd =
            start + markdown.length;
        });
      } else {
        setContent((prev) => `${prev}\n${markdown}\n`);
      }
    }
    setMediaPickerTarget(null);
  };

  return (
    <BlogLayout>
      <Seo
        title="Write a post | Oscar Arreola"
        description="Blog post editor"
        path="/blog/new"
      />
      <div className="mx-auto mb-16 mt-12 flex max-w-screen-xl flex-col px-10 lg:w-[80%]">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-secondary">
            {existing ? "Edit post" : "New post"}
          </h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("edit")}
              className={cn(
                buttonVariants({
                  variant: mode === "edit" ? "default" : "secondary",
                  size: "sm",
                }),
              )}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setMode("preview")}
              className={cn(
                buttonVariants({
                  variant: mode === "preview" ? "default" : "secondary",
                  size: "sm",
                }),
              )}
            >
              Preview
            </button>
          </div>
        </div>

        {mode === "preview" ? (
          <PostPreview
            title={title}
            coverImage={coverImage}
            content={content}
            authorName={session?.user?.name ?? "Oscar Arreola"}
          />
        ) : (
          <div className="flex gap-8">
            <form
              onSubmit={handleSubmit}
              className="flex flex-1 flex-col gap-4"
            >
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Input
                placeholder="Excerpt (shown in the post list and link previews)"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Cover image URL (used for the post header and social previews)"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setMediaPickerTarget("cover")}
                  >
                    Choose image
                  </Button>
                </div>
                {coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="h-32 w-auto rounded-md object-cover"
                  />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Textarea
                  ref={contentRef}
                  placeholder="Write in Markdown — supports images with ![alt](url) and links with [text](url)"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                  required
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="self-start"
                  onClick={() => setMediaPickerTarget("content")}
                >
                  Insert image into post
                </Button>
              </div>

              <label className="flex items-center gap-2 text-secondary">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
                Published
              </label>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSaving}>
                  {isSaving
                    ? "Saving..."
                    : existing
                      ? "Save changes"
                      : "Create post"}
                </Button>
                {existing && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove.mutate({ id: existing.id })}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </form>

            <aside className="w-64 shrink-0">
              <h2 className="mb-2 text-lg font-semibold text-secondary">
                All posts
              </h2>
              <ul className="flex flex-col gap-1 text-sm">
                <li>
                  <Link
                    href="/blog/new"
                    className="text-palette-blue underline"
                  >
                    + New post
                  </Link>
                </li>
                {existingPosts?.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/blog/new?id=${post.id}`}
                      className="text-quaternary hover:text-secondary"
                    >
                      {post.title} {!post.published && "(draft)"}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        )}
      </div>

      <MediaPicker
        open={mediaPickerTarget !== null}
        onOpenChange={(open) => !open && setMediaPickerTarget(null)}
        onSelect={handleMediaSelect}
      />
    </BlogLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session || session.user.email !== env.ADMIN_EMAIL) {
    return { notFound: true };
  }

  return { props: {} };
};
