import About from "~/data/json/About.json";
import Experience from "~/data/json/Experience.json";
import Projects from "~/data/json/Projects.json";
import General from "~/data/json/General.json";
import Competitions from "~/data/json/Competitions.json";

import {
  aboutSchema,
  experienceSchema,
  projectsSchema,
  generalSchema,
} from "./schemas";

const aboutInfo = aboutSchema.parse(About);

export const logos = aboutInfo.logos;
export const programmingLanguages = aboutInfo.programmingLanguages;
export const technologies = aboutInfo.technologies;

const experienceInfo = experienceSchema.parse(Experience);

export const experience = experienceInfo.experience;

const projectsInfo = projectsSchema.parse(Projects);

export const projects = projectsInfo.projects;

const competitionsInfo = projectsSchema.parse(Competitions);

export const competitions = competitionsInfo.projects;

export const technologiesOptions = projectsInfo.technologiesOptions;

const generalInfo = generalSchema.parse(General);

export const contact = generalInfo.contact;

export const githubRepo = generalInfo.github_repo;
export const githubOwner = generalInfo.github_owner;
export const githubEmail = generalInfo.github_email;
export const githubNoReplyEmail = generalInfo.github_noreply_email; // Email used by github when the user iteracts through the web interface (see using git log)
