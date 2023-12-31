import About from "~/data/json/About.json";
import Experience from "~/data/json/Experience.json";
import Projects from "~/data/json/Projects.json";
import General from "~/data/json/General.json";

import { aboutSchema, experienceSchema, projectsSchema, generalSchema } from "./schemas";

const aboutInfo = aboutSchema.parse(About);

export const logos = aboutInfo.logos;
export const programmingLanguages = aboutInfo.programmingLanguages;
export const technologies = aboutInfo.technologies;

const experienceInfo = experienceSchema.parse(Experience);

export const experience = experienceInfo.experience;

const projectsInfo = projectsSchema.parse(Projects);

export const projects = projectsInfo.projects;
export const technologiesOptions = projectsInfo.technologiesOptions;

const generalInfo = generalSchema.parse(General);

export const contact = generalInfo.contact;
export const lastUpdate = generalInfo.last_update;