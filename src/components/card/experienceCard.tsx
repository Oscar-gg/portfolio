import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "~/components/ui/dialog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

import { FaExternalLinkAlt, FaImage } from "react-icons/fa";
import { ImageCarousel } from "../carousel/imageCarousel";
import { twMerge } from "tailwind-merge";

export interface ImageInfo {
  path: string;
  description: string;
}

interface LinkInfo {
  path: string;
  description: string;
}

export const ExperienceCard = ({
  title,
  description,
  images,
  date,
  position,
  links,
  className,
}: {
  title: string;
  description: string[];
  images: ImageInfo[];
  date: string;
  position: string;
  links: LinkInfo[];
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        "flex flex-col items-center p-6 text-white",
        className,
      )}
    >
      {/* On large screens */}
      <div className="hidden w-full flex-row items-end justify-between space-x-4 align-middle  md:flex">
        <p className="whitespace-nowrap text-palette-blue">{date}</p>
        <h4 className="text-center text-4xl ">{title}</h4>
        <p className="whitespace-nowrap">{position}</p>
      </div>

      {/* On small screens */}
      <div className="md:hidden">
        <h4 className="text-4xl">{title}</h4>
        <div className="my-3 flex w-full flex-row flex-wrap justify-between gap-x-10 align-bottom">
          <p className="whitespace-nowrap text-palette-blue">{date}</p>
          <p>{position}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-col items-center justify-center gap-6 align-middle md:mt-9 md:flex-row md:items-start">
        <img
          className="w-full md:w-[40%]"
          src={images[0] ? images[0].path : " "}
          alt={images[0]?.description}
        />
        <div className="mb-auto mt-auto md:ml-10">
          <ul className="list-disc marker:text-white">
          {description.map((paragraph, index) => (
            <li className="mb-4" key={index}>
              {paragraph}
            </li>
          ))}
          </ul>
        </div>
      </div>
      {(links.length > 0 || images.length > 1) && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>More</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-row flex-wrap gap-6">
                {images.length > 1 && (
                  <Dialog>
                    <DialogTrigger>
                      <div className="flex flex-row items-center justify-start gap-x-3">
                        <FaImage size={40} />{" "}
                        <p className="items-center text-lg">See Images</p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center">
                      <h3 className="mb-4 text-2xl text-white">{title}</h3>
                      <ImageCarousel images={images} />
                    </DialogContent>
                  </Dialog>
                )}
                {links?.map((link) => (
                  <a key={link.path} href={link.path} target="_blank">
                    <div className="flex flex-row items-center justify-start gap-x-3">
                      <FaExternalLinkAlt size={35} />{" "}
                      <p className="items-center text-lg">{link.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};
