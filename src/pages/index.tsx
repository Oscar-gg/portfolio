import { Layout } from "~/components/Layout/Layout";
import { Home } from "../components/Home";
import { About } from "~/components/About";
import { Experience } from "~/components/Experience";
import { Projects } from "~/components/Projects";

export default function HomePage() {
  return (
    <>
      <Layout>
        <Home />
        <About />
        <Experience />
        <Projects />
      </Layout>
    </>
  );
}
