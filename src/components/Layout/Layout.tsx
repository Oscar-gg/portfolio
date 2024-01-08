import { Navbar, type Route } from "~/components/Layout/Navbar";
import { Footer } from "~/components/Layout/Footer";
import Head from "next/head";
import {
  useEffect,
  useRef,
  useState,
  cloneElement,
  Children,
  type Dispatch,
} from "react";
import React from "react";
import { z } from "zod";

const routesDefault: Route[] = [
  { name: "About", path: "#about" },
  { name: "Experience", path: "#experience" },
  { name: "Projects", path: "#projects" },
  { name: "Contact", path: "#contact" },
];

const handleResize = ({
  navBarHeight,
  routes,
  setRoutes,
  sectionRef,
}: {
  navBarHeight: number;
  routes: Route[];
  setRoutes: Dispatch<React.SetStateAction<Route[]>>;
  sectionRef: React.MutableRefObject<HTMLDivElement[]>;
}) => {
  // Add heights to routes
  for (let i = 0; i < routes?.length; i++) {
    if (!sectionRef.current[i]) {
      continue;
    }

    const name = routes[i]?.name ?? "";
    const path = routes[i]?.path ?? "";

    const viewPortPosition = sectionRef.current[i]?.getBoundingClientRect();

    // Element height: scroll height at which the route is highlighted
    // * Highlight the route once the element is 200px from the bottom of the navbar
    const elementHeight = viewPortPosition?.top
      ? viewPortPosition.top + window.scrollY - navBarHeight - 200
      : 0;
    routes[i] = {
      path: path,
      name: name,
      height: elementHeight,
    };
  }
  setRoutes(routes);
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [navHeight, setNavHeight] = useState(0);
  const spacerRef = useRef<HTMLDivElement>(null);
  const [routes, setRoutes] = useState<Route[]>(routesDefault);
  const sectionRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (spacerRef.current) {
      spacerRef.current.style.height = `${navHeight}px`;
    }
  }, [navHeight]);

  // Add reference to each child, to set the appropriate height dynamically for Navbar color change
  const refChildren = Children.map(
    children as React.DetailedReactHTMLElement<object, HTMLElement>[],
    (child) => {
      if (!child.key) {
        return child;
      }
      const childProps = {
        ref: (ref: HTMLDivElement) => {
          const index = z.coerce.number().safeParse(child.key);

          if (index.success) {
            sectionRef.current[index.data] = ref;
          }
        },
      };

      return cloneElement(child, childProps);
    },
  );

  useEffect(() => {
    handleResize({
      navBarHeight: navHeight,
      routes: routes,
      setRoutes: setRoutes,
      sectionRef: sectionRef,
    });
    window.addEventListener("resize", () => {
      handleResize({
        navBarHeight: navHeight,
        routes: routes,
        setRoutes: setRoutes,
        sectionRef: sectionRef,
      });
    });
    return () => {
      window.removeEventListener("resize", () => {
        handleResize({
          navBarHeight: navHeight,
          routes: routes,
          setRoutes: setRoutes,
          sectionRef: sectionRef,
        });
      });
    };
  }, [sectionRef]);

  return (
    <>
      <Head>
        <title>Oscar Arreola</title>
        <meta name="description" content="Oscar's portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar routes={routes} setNavHeight={setNavHeight} />
      <div ref={spacerRef} className=""></div>
      {refChildren}
      <Footer routes={routes} />
    </>
  );
};
