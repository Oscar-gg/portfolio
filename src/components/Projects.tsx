import { projects, competitions } from "~/data/typed/objects";

import { useState } from "react";
import { ProjectList } from "./List/projectList";
import { ProjectFilter } from "./filter/projectFilter";

import type { TechnologyItem } from "./filter/projectFilter";

export const Projects = ({additionalExperience} : {additionalExperience: boolean}) => {
  const [filteredProjects, setFilteredProjects] = useState(additionalExperience ? projects : competitions);
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
      <ProjectList projects={filteredProjects} hasFilters={hasFilters} isProject={!additionalExperience} />
    </>
  );
};
