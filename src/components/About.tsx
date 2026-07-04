
import {
  logos,
  technologies,
  programmingLanguages,
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
      <div className="flex flex-col gap-y-5">
        <div>
          <h3 className="mb-3 text-2xl text-white">Programming Languages</h3>
          <IconList className="" list={programmingLanguages} maxItems={8} />
        </div>
        <div>
          <h3 className="mb-3 text-2xl text-white">Technologies</h3>
          <IconList size="small" list={technologies} maxItems={6} accordionMessage="Additional technologies used"/>
        </div>
      </div>
    </>
  );
};
