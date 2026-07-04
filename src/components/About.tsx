
import {
  logos,
  technologies,
  programmingLanguages,
  education,
  spokenLanguages,
} from "~/data/typed/objects";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import { IconList } from "./List/iconList";

export const About = () => {
  return (
    <>
      <div className="mb-10 flex flex-row flex-wrap gap-x-3 gap-y-3">
        <p className="mx-3 mt-2 text-justify text-white lg:w-[40%]">
          I'm a software developer passionate about building impactful products
          and tackling complex problems. I've had the opportunity to intern at
          Uber and work across web, mobile, and robotics projects as a member of
          RoBorregos and Dataexpress. I'm always looking to expand my skills and
          contribute to fast-moving teams.
        </p>
        <div className="flex w-full flex-row flex-wrap justify-around gap-x-3 gap-y-3 lg:w-[50%]">
          {logos.map((logo) => (
            <div key={logo.path}>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>
                    <img className="h-40 w-40" src={logo.path} alt={logo.alt} />
                  </TooltipTrigger>
                  <TooltipContent sideOffset={-4}>
                    <p>{logo.alt}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <p></p>
            </div>
          ))}
        </div>
      </div>
      {education && (
        <div className="mb-10 rounded-lg border border-zinc-700 p-5">
          <h3 className="mb-1 text-xl font-semibold text-white">
            {education.institution}
          </h3>
          <p className="text-palette-blue">{education.degree}</p>
          <p className="mb-3 text-sm text-zinc-400">{education.date}</p>
          <ul className="flex flex-row flex-wrap gap-x-6 gap-y-1">
            {education.details.map((detail) => (
              <li key={detail} className="text-zinc-300">
                {detail}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex flex-col gap-y-5">
        <div>
          <h3 className="mb-3 text-2xl text-white">Programming Languages</h3>
          <IconList className="" list={programmingLanguages} maxItems={8} />
        </div>
        <div>
          <h3 className="mb-3 text-2xl text-white">Technologies</h3>
          <IconList size="small" list={technologies} maxItems={6} accordionMessage="Additional technologies used"/>
        </div>
        {spokenLanguages && spokenLanguages.length > 0 && (
          <div>
            <h3 className="mb-3 text-2xl text-white">Languages</h3>
            <div className="flex flex-row flex-wrap gap-x-6 gap-y-2">
              {spokenLanguages.map((lang) => (
                <div key={lang.language} className="flex flex-row items-center gap-x-2">
                  <span className="text-white">{lang.language}</span>
                  <span className="rounded bg-zinc-800 px-2 py-0.5 text-sm text-zinc-400">
                    {lang.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
