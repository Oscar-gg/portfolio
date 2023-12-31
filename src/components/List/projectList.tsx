import { ProjectCard, ProjectInfo } from "~/components/card/projectCard";

export const ProjectList = ({ projects }: { projects: ProjectInfo[] }) => {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.title} projectInfo={project} />
      ))}
    </div>
  );
};
