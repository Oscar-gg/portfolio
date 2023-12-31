import { z } from "zod";

const listElementSchema = z.object({
  title: z.string(),
  description: z.string(),
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
      description: z.string(),
    }),
  ),
});

export const projectsSchema = z.object({
  projects: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.string(),
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
