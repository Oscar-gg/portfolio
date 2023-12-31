import { ProjectCard, ProjectInfo } from "~/components/card/projectCard";

export const ProjectList = ({ projects }: { projects: ProjectInfo[] }) => {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {projects.length > 0 ? (
        projects.map((project) => (
          <ProjectCard key={project.title} projectInfo={project} />
        ))
      ) : (
        <p className="text-white">
          No projects found with the specified filters.
        </p>
      )}
    </div>
  );
};
