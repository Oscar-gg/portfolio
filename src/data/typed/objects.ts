import About from "~/data/json/About.json";


import {aboutSchema} from "./schemas";

const aboutInfo = aboutSchema.parse(About);

export const logos = aboutInfo.logos;
export const programmingLanguages = aboutInfo.programmingLanguages;
export const technologies = aboutInfo.technologies;