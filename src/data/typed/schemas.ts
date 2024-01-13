import { z } from "zod";

const listElementSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  image: z.string(),
});

export const aboutSchema = z.object({
  logos: z.array(
    z.object({
      path: z.string(),
      href: z.string().nullable(),
      alt: z.string(),
    }),
  ),
  programmingLanguages: z.array(listElementSchema),
  technologies: z.array(listElementSchema),
});

export const experienceSchema = z.object({
  experience: z.array(
    z.object({
      title: z.string(),
      date: z.string(),
      position: z.string(),
      images: z.array(
        z.object({
          path: z.string(),
          description: z.string(),
        }),
      ),
      links: z.array(z.object({ path: z.string(), description: z.string() })),
      description: z.array(z.string()),
    }),
  ),
});

export const projectsSchema = z.object({
  projects: z.array(
    z.object({
      title: z.string(),
      github_repo: z.string().optional(),
      description: z.array(z.string()),
      dateStart: z.string().pipe(z.coerce.date()),
      dateEnd: z.string().pipe(z.coerce.date()),
      links: z.array(z.object({ path: z.string(), description: z.string() })),
      images: z.array(
        z.object({
          path: z.string(),
          description: z.string(),
        }),
      ),
      technologies: z.array(z.string()),
    }),
  ),
  technologiesOptions: z.array(z.string()),
});

export const generalSchema = z.object({
  contact: z.object({
    github: z.string(),
    linkedin: z.string(),
    email: z.string(),
  }),
  github_repo: z.string(),
  github_owner: z.string(),
  github_email: z.string(),
  github_noreply_email: z.string(),
});
