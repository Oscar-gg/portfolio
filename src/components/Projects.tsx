import { Section } from "~/components/Layout/Section";

import { projects } from "~/data/typed/objects";

import { RefObject, useEffect, useRef, useState } from "react";
import { ProjectCard } from "~/components/card/projectCard";
import { ProjectList } from "./List/projectList";
import { ProjectFilter } from "./filter/projectFilter";

import { TechnologyItem } from "./filter/projectFilter";

export const Projects = () => {
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [filterState, setFilterState] = useState({
    technologies: [] as TechnologyItem[],
    search: "",
    after: "",
    before: "",
  });


  return (
    <Section title="Projects">
      <p className="mb-5 text-justify text-white">
        These are some of the projects I have worked on. You can click on them
        to see more details.
      </p>
      <ProjectFilter
        projects={projects}
        setFilteredProjects={setFilteredProjects}
        filterState={filterState}
        setFilterState={setFilterState}
      />
      <ProjectList projects={filteredProjects} />
    </Section>
  );
};
