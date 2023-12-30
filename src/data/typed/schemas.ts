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

