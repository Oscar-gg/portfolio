import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

import { FaExternalLinkAlt, FaImage } from "react-icons/fa";
import { Card, CardContent } from "~/components/ui/card";

import { ImageCarousel } from "../carousel/imageCarousel";

export interface ImageInfo {
  path: string;
  description: string;
}

export interface LinkInfo {
  path: string;
  description: string;
}

export interface ProjectInfo {
  title: string;
  description: string[];
  dateStart: Date;
  dateEnd: Date;
  links: LinkInfo[];
  images: ImageInfo[];
  technologies: string[];
  className?: string;
}

const dateOptions = {
  year: "2-digit",
  month: "numeric",
  day: "numeric",
} as const;

export const ProjectCard = ({
  projectInfo,
}: {
  projectInfo: ProjectInfo;
  className?: string;
}) => {
  const {
    title,
    description,
    dateStart,
    dateEnd,
    links,
    images,
    technologies,
  } = projectInfo;

  return (
    <Card className=" h-fit bg-black">
      <CardContent className="flex h-fit flex-col gap-3 pb-0 text-white">
        <div className="flex flex-col items-center">
          <p className="mb-3 ml-auto mt-3 whitespace-nowrap text-palette-blue">
            {dateStart.toLocaleDateString(undefined, dateOptions)} -{" "}
            {dateEnd.toLocaleDateString(undefined, dateOptions)}
          </p>
          <h4 className="text-4xl">{title}</h4>
        </div>
        <div className="mt-3 flex flex-col items-center gap-3 md:mt-9 md:flex-row md:items-start">
          <img
            className="h-44 w-44"
            src={images[0] ? images[0].path : " "}
            alt={images[0]?.description}
          />
          <div>
            {description.map((paragraph, index) => (
              <p className="mb-4" key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
        {(links.length > 0 || images.length > 1 || technologies.length > 0) && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem className="border-b-0" value="item-1">
              <AccordionTrigger>Details</AccordionTrigger>
              <AccordionContent>
                {technologies.length > 0 && (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Technologies</AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-row flex-wrap gap-3">
                          {technologies.map((technology) => (
                            <p key={technology}>{technology}</p>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
                {links.length > 0 && (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        Link{links.length > 1 && "s"}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-row flex-wrap gap-3">
                          {links?.map((link) => (
                            <a key={link.path} href={link.path}>
                              <div className="flex flex-row items-center justify-start gap-x-3">
                                <FaExternalLinkAlt size={25} />{" "}
                                <p className="items-center text-lg">
                                  {link.description}
                                </p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
                {images.length > 1 && (
                  <Dialog>
                    <DialogTrigger>
                      <div className="mt-5 flex flex-row items-center justify-start gap-x-3">
                        <FaImage size={30} />{" "}
                        <p className="items-center text-lg">Project Images</p>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <div className="flex flex-col items-center justify-center align-middle">
                        <h3 className="mb-4 text-2xl text-white">{title}</h3>
                        <ImageCarousel images={images} />
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};
