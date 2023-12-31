import About from "~/data/json/About.json";
import Experience from "~/data/json/Experience.json";


import {aboutSchema, experienceSchema} from "./schemas";

const aboutInfo = aboutSchema.parse(About);

export const logos = aboutInfo.logos;
export const programmingLanguages = aboutInfo.programmingLanguages;
export const technologies = aboutInfo.technologies;

const experienceInfo = experienceSchema.parse(Experience);

export const experience = experienceInfo.experience;