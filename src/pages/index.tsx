import { Layout } from "~/components/Layout/Layout";
import { Home } from "~/components/Home";
import { About } from "~/components/About";
import { Experience } from "~/components/Experience";
import { Projects } from "~/components/Projects";
import { useState } from "react";
import { Section } from "~/components/Layout/Section";

export default function HomePage() {
  return (
    <Layout>
      <Home />
      <Section title="About" key="0" id="about">
        <About />
      </Section>
      <Section title="Experience" key="1" id="experience">
        <Experience key="3" />
      </Section>
      <Section title="Projects" key="2" id="projects">
        <Projects key="4" />
      </Section>
    </Layout>
  );
}
