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
import { useState } from "react";

import { MdExpandMore } from "react-icons/md";
import { MdExpandLess } from "react-icons/md";
import { api } from "~/utils/api";

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
  result?: string;
  links: LinkInfo[];
  images: ImageInfo[];
  technologies: string[];
  className?: string;
  github_repo?: string;
}

const dateOptions = {
  year: "2-digit",
  month: "numeric",
  day: "numeric",
} as const;

export const ProjectCard = ({
  projectInfo,
  isProject,
}: {
  projectInfo: ProjectInfo;
  isProject: boolean;
}) => {
  const {
    title,
    description,
    dateStart,
    dateEnd,
    links,
    images,
    technologies,
    github_repo,
  } = projectInfo;

  const [seeMore, setSeeMore] = useState(false);
  const [openedCommitContributions, setOpenedCommitContributions] =
    useState(false);

  const {
    data: commitContributions,
    isLoading,
    isError,
  } = api.github.fetchCommitContributions.useQuery(
    { repo_url: github_repo ?? "" },
    { enabled: Boolean(github_repo) && openedCommitContributions },
  );

  return (
    <Card className="relative h-fit overflow-hidden bg-black">
      <div
        style={{
          backgroundImage: `url('${images[0] ? images[0].path : " "}')`,
        }}
        className="h-64 w-full border-[1px] border-white bg-white bg-contain bg-center bg-no-repeat"
      ></div>
      <CardContent className="mt-3 flex h-fit flex-col pb-0 text-white">
        <h4 className="mb-3 text-center text-4xl">{title}</h4>
        {projectInfo.result && (
          <h5 className="text-center text-highlight">{projectInfo.result}</h5>
        )}
        <div className="mt-3 flex flex-col items-center gap-3">
          <div>
            {seeMore ? (
              <>
                {description.map((paragraph, index) => (
                  <p className="mb-4" key={index}>
                    {paragraph}
                  </p>
                ))}
                <MdExpandLess
                  onClick={() => setSeeMore(false)}
                  className="ml-auto mr-auto text-palette-blue"
                  size={35}
                />
              </>
            ) : (
              <>
                <p className="mb-4">{description[0]}</p>
                {description.length > 1 && (
                  <MdExpandMore
                    onClick={() => setSeeMore(true)}
                    className="ml-auto mr-auto text-palette-blue"
                    size={35}
                  />
                )}
              </>
            )}
          </div>
        </div>

        <p className="ml-auto mr-4 whitespace-nowrap text-right text-palette-blue">
          {dateStart.toLocaleDateString(undefined, dateOptions)} -{" "}
          {dateEnd.toLocaleDateString(undefined, dateOptions)}
        </p>

        {(links.length > 0 ||
          images.length > 1 ||
          technologies.length > 0 ||
          github_repo) && (
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
                {github_repo && (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem
                      value="item-2"
                      onClick={(e) => {
                        setOpenedCommitContributions(true);
                      }}
                    >
                      <AccordionTrigger>
                        My contributions (github stats)
                      </AccordionTrigger>
                      <AccordionContent>
                        {isLoading && <p>Loading...</p>}
                        {isError && <p>Error while fetching</p>}
                        {commitContributions && (
                          <div className="flex flex-col flex-wrap gap-3">
                            <p>
                              Commits: {commitContributions.userCommits} out of{" "}
                              {commitContributions.commitCount}
                            </p>
                            <p>Additions: {commitContributions.additions}</p>
                            <p>Deletions: {commitContributions.deletions}</p>
                            <p>
                              Last commit date:{" "}
                              {commitContributions.lastCommitDate?.toDateString() ??
                                "Error while fetching"}
                            </p>
                            <a href={github_repo} target="_blank">
                              <div className="flex flex-row items-center justify-start gap-x-3">
                                <FaExternalLinkAlt size={20} />{" "}
                                <p className="items-center text-lg">Link</p>
                              </div>
                            </a>
                          </div>
                        )}
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
                            <a key={link.path} href={link.path} target="_blank">
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
                        <p className="items-center text-lg">
                          {isProject ? "Project Images" : "Competition Images"}
                        </p>
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
