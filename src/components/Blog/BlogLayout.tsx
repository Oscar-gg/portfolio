import Head from "next/head";
import Link from "next/link";
import { Home } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";

const AccountMenu = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Account menu"
        aria-expanded={open}
        className="block h-8 w-8 overflow-hidden rounded-full border border-gray-500 transition-colors hover:border-palette-blue"
      >
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt={session.user.name ?? "Account"}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-gray-700 text-xs font-semibold text-white">
            {session.user.name
              ?.trim()
              .split(/\s+/)
              .map((part) => part[0]?.toUpperCase())
              .join("") ?? "?"}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-44 rounded-lg border border-gray-600 bg-gray-900 py-2 shadow-lg">
          <p className="truncate px-3 py-1 text-sm text-white">
            {session.user.name}
          </p>
          <button
            onClick={() => void signOut()}
            className="block w-full px-3 py-1.5 text-left text-sm text-quaternary transition-colors hover:text-palette-blue"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

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
          <div className="flex items-center gap-4">
            <AccountMenu />
            <Link
              href="/"
              title="Back to portfolio"
              aria-label="Back to portfolio"
              className="text-white transition-colors hover:text-palette-blue"
            >
              <Home className="h-5 w-5" />
            </Link>
          </div>
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
