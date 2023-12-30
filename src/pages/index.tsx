import { Home } from "../components/Home";
import { About } from "~/components/About";
import { Layout } from "~/components/Layout/Layout";

export default function HomePage() {
  return (
    <>
      <Layout>
        <Home />
        <About />
      </Layout>
    </>
  );
}
