import { Section } from "~/components/Layout/Section";

import { projects } from "~/data/typed/objects";

import { RefObject, useEffect, useRef, useState } from "react";
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

  const hasFilters =
    filterState.technologies.length > 0 ||
    filterState.search !== "" ||
    filterState.after !== "" ||
    filterState.before !== "";

  return (
    <>
      <ProjectFilter
        projects={projects}
        setFilteredProjects={setFilteredProjects}
        filterState={filterState}
        setFilterState={setFilterState}
      />
      <ProjectList projects={filteredProjects} hasFilters={hasFilters} />
    </>
  );
};
