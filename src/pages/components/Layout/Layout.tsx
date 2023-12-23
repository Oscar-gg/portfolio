import { Navbar } from "~/pages/components/Layout/Navbar";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [navHeight, setNavHeight] = useState(0);
  const spacerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (spacerRef.current) {
      spacerRef.current.style.height = `${navHeight}px`;
    }
  }, [navHeight]);

  return (
    <>
      <Head>
        <title>Oscar Arreola</title>
        <meta name="description" content="Oscar's portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar
        routes={[
          { name: "Home", path: "/", height: 10 },
          { name: "About", path: "/about", height: 20 },
          { name: "Projects", path: "/projects", height: 30 },
          { name: "Contact", path: "/contact", height: 40 },
        ]}
        setNavHeight={setNavHeight}
      />
      <div ref={spacerRef} className=""></div>
      {children}
    </>
  );
};
