import { Navbar } from "~/pages/components/Layout/Navbar";
import Head from "next/head";

export const Layout = ({ children }: { children: React.ReactNode }) => {
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
      />
      {children}
    </>
  );
};
