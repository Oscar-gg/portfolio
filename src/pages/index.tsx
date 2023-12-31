import { Home } from "../components/Home";
import { About } from "~/components/About";
import { Experience } from "~/components/Experience";
import { Layout } from "~/components/Layout/Layout";

export default function HomePage() {
  return (
    <>
      <Layout>
        <Home />
        <About />
        <Experience />
      </Layout>
    </>
  );
}
