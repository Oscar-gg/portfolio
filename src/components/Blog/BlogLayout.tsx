import Head from "next/head";
import Link from "next/link";
import { Home } from "lucide-react";
import { type ReactNode } from "react";

export const BlogLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Oscar Arreola's Blog"
          href="/blog/rss.xml"
        />
      </Head>

      <nav className="fixed start-0 top-0 z-20 w-full border-b-[1px] border-gray-500 bg-primary">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between p-4">
          <Link
            href="/blog"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center whitespace-nowrap text-2xl font-semibold text-white transition-colors hover:text-palette-blue">
              OAA
            </span>
            <span className="text-quaternary">/</span>
            <span className="text-lg text-white">Blog</span>
          </Link>
          <Link
            href="/"
            title="Back to portfolio"
            aria-label="Back to portfolio"
            className="text-white transition-colors hover:text-palette-blue"
          >
            <Home className="h-5 w-5" />
          </Link>
        </div>
      </nav>

      <div className="flex-1 pt-20">{children}</div>

      <footer className="flex w-full items-center justify-center gap-4 bg-primary p-6">
        <Link
          href="/blog"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center whitespace-nowrap text-2xl font-semibold text-white transition-colors hover:text-palette-blue">
            OAA
          </span>
          <span className="text-quaternary">/</span>
          <span className="text-lg text-white">Blog</span>
        </Link>
        <Link
          href="/"
          title="Back to portfolio"
          aria-label="Back to portfolio"
          className="text-white transition-colors hover:text-palette-blue"
        >
          <Home className="h-5 w-5" />
        </Link>
      </footer>
    </div>
  );
};
