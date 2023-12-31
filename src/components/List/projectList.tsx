import { ProjectCard, ProjectInfo } from "~/components/card/projectCard";

export const ProjectList = ({ projects, hasFilters }: { projects: ProjectInfo[], hasFilters: boolean }) => {
  const visibleProjects = projects.slice(0, 7);

  return (
    <div>
      {projects.length !== visibleProjects.length && (
        <p className="text-white mb-4">
          Showing {visibleProjects.length} of {projects.length} {hasFilters && "filtered"} projects.
        </p>
      )}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {visibleProjects.length > 0 ? (
          visibleProjects.map((project) => (
            <ProjectCard key={project.title} projectInfo={project} />
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
