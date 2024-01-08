import { Layout } from "~/components/Layout/Layout";
import { Home } from "~/components/Home";
import { About } from "~/components/About";
import { Experience } from "~/components/Experience";
import { Projects } from "~/components/Projects";
import { Section } from "~/components/Layout/Section";
import { Contact } from "~/components/Contact";

export default function HomePage() {
  return (
    <Layout>
      <Home />
      {/* Ids should match path specified in the Navbar */}
      {/* Keys must match index of path in route array passed to the layout */}
      <Section title="About" key="0" id="about">
        <About />
      </Section>
      <Section title="Experience" key="1" id="experience">
        <Experience />
      </Section>
      <Section title="Projects" key="2" id="projects">
        <Projects />
      </Section>
      <Section title="Contact" key="3" id="contact">
        <Contact />
      </Section>
    </Layout>
  );
}
