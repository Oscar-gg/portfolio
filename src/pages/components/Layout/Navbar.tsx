import { useEffect, useState, useRef, RefObject } from "react";
import { env } from "~/env.js";

export const Navbar = ({
  routes,
}: {
  routes: {
    name: string;
    path: string;
    height?: number;
  }[];
}) => {
  const [redirect, setRedirect] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [displayButton, setDisplayButton] = useState(false);
  const pastPath = useRef<string>("");
  const routeRefs: Record<string, RefObject<HTMLAnchorElement>> = {};

  const filteredRoutes = routes.filter(
    (route) => route.height !== null && route.height !== undefined,
  );

  filteredRoutes.forEach((route) => {
    routeRefs[route.path] = useRef<HTMLAnchorElement>(null);
  });

  filteredRoutes.sort((a, b) => (a.height || 0) - (b.height || 0));

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setDisplayButton(true);
      menuRef.current?.classList.add("scale-0");
    } else {
      setDisplayButton(false);
      menuRef.current?.classList.remove("scale-0");
    }
  };
  const handleScroll = () => {
    let max: number = 0;
    let path = "";
    const scrollY = window.scrollY;

    for (let i = 0; i < filteredRoutes.length; i++) {
      const route = filteredRoutes[i];

      if (route?.height && scrollY >= route.height && route.height > max) {
        max = route.height;
        path = route.path;
      }
    }

    if (path === pastPath.current) {
      pastPath.current = path;
      for (const ref in routeRefs) {
        if (ref !== path) {
          routeRefs[ref]?.current?.classList.remove("text-palette-blue");
          routeRefs[ref]?.current?.classList.add("text-white");
        } else {
          routeRefs[ref]?.current?.classList.add("text-palette-blue");
          routeRefs[ref]?.current?.classList.remove("text-white");
        }
      }
    }
  };

  useEffect(() => {
    if (window.location.origin !== env.NEXT_PUBLIC_PROJECT_URL) {
      setRedirect(true);
    }
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
  }, []);

  const handleOpenMenu = () => {
    // menuRef?.current?.classList?.toggle("hidden");
    buttonRef?.current?.classList?.toggle("rotate-90");
    if (buttonRef?.current?.classList.contains("rotate-90")) {
      menuRef.current?.classList.remove("scale-0");
      menuRef.current?.classList.remove("h-0");
    } else {
      menuRef.current?.classList.add("scale-0");
      menuRef.current?.classList.add("h-0");
    }
  };

  return (
    <nav className="fixed start-0 top-0 z-20 w-full bg-primary dark:border-gray-600 dark:bg-gray-900">
      <div className="flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <a
          {...(redirect ? { href: env.NEXT_PUBLIC_PROJECT_URL } : {})}
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center whitespace-nowrap text-2xl font-semibold text-white">
            OAA
          </span>
        </a>
        {displayButton && (
          <div className="flex space-x-3 rtl:space-x-reverse md:order-2 md:space-x-0">
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 duration-500 ease-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
              aria-controls="navbar-sticky"
              aria-expanded="false"
              onClick={handleOpenMenu}
              ref={buttonRef}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
        )}
        <div
          className="w-full items-center justify-between duration-500 ease-in-out md:order-1 md:flex md:w-fit"
          id="navbar-sticky"
          ref={menuRef}
        >
          <ul className="mt-4 flex flex-col rounded-lg border p-4 font-medium rtl:space-x-reverse  md:mt-0 md:flex-row md:space-x-8 md:border-0  md:p-0 ">
            {routes.map((route) => (
              <li key={route.path}>
                <a
                  href={route.path}
                  ref={routeRefs[route.path]}
                  className="block rounded px-3 py-2 text-white duration-500 ease-in-out "
                  aria-current="page"
                >
                  {route.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};
