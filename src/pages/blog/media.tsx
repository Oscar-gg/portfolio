import Link from "next/link";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import { env } from "~/env";
import { BlogLayout } from "~/components/Blog/BlogLayout";
import { MediaLibrary } from "~/components/Blog/MediaLibrary";
import { Seo } from "~/components/Seo";

export default function MediaLibraryPage() {
  return (
    <BlogLayout>
      <Seo
        title="Media library | Oscar Arreola"
        description="Manage blog images"
        path="/blog/media"
      />
      <div className="mx-auto mb-16 mt-12 flex max-w-screen-xl flex-col gap-6 px-10 lg:w-[80%]">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-secondary">Media library</h1>
          <Link href="/blog/new" className="text-palette-blue underline">
            + New post
          </Link>
        </div>

        <MediaLibrary />
      </div>
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
