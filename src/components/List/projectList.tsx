import { ProjectCard, type ProjectInfo } from "~/components/card/projectCard";

export const ProjectList = ({
  projects,
  hasFilters,
  sortDate = true,
  isProject = true,
}: {
  projects: ProjectInfo[];
  hasFilters: boolean;
  sortDate?: boolean;
  isProject?: boolean;
}) => {
  if (sortDate) {
    projects.sort((a, b) => {
      if (a.dateEnd === null) {
        return 1;
      }
      if (b.dateEnd === null) {
        return -1;
      }
      return b.dateEnd.getTime() - a.dateEnd.getTime();
    });
  }
  const visibleProjects = projects.slice(0, 7);

  return (
    <div>
      {projects.length !== visibleProjects.length && (
        <p className="mb-4 text-white">
          Showing {visibleProjects.length} of {projects.length}{" "}
          {hasFilters && "filtered "}
          {isProject ? "projects" : "items"}.
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {visibleProjects.length > 0 ? (
          visibleProjects.map((project) => (
            <ProjectCard
              key={project.title}
              projectInfo={project}
              isProject={isProject}
            />
          ))
        ) : (
          <p className="text-white">
            No projects found with the specified filters.
          </p>
        )}
      </div>
    </div>
  );
};
