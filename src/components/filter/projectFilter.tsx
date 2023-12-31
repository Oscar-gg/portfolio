import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { type ProjectInfo } from "../card/projectCard";
import Select from "react-select";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

import { Input } from "~/components/ui/input";
import { technologiesOptions } from "~/data/typed/objects";

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    background: "#0F0F0F", // Background color of the control
    // borderColor: state.isFocused ? "darkblue" : "gray", // Border color when focused or unfocused
    // boxShadow: state.isFocused ? "0 0 0 1px darkblue" : null, // Box shadow when focused
    color: "white", // Text color
    paddingTop: "1px",
    paddingBottom: "1px",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    background: state.isFocused ? "#18181B" : null, // Background color when selected
    // color: "white", // Text color when selected
  }),
  menu: (provided: any) => ({
    ...provided,
    background: "black", // xBackground color of the dropdown menu
  }),

  multiValueLabel: (provided: any) => ({
    ...provided,
    color: "white",
    background: "#000000",
    border: "1px solid white",
    borderRadius: "1px",
    borderRight: "none",
    paddingRight: "6px",
  }),
  multiValueRemove: (provided: any, state: any) => ({
    ...provided,
    ":hover": {
      background: "white",
      color: "black",
    },
    color: state.isFocused || state.hover ? "black" : "white",
    border: "1px solid white",
    borderLeft: "none",
    borderRadius: "1px",
    background: state.isFocused ? "white" : "black",
  }),
};

export interface TechnologyItem {
  value: string;
  label: string;
}

interface FilterData {
  technologies: TechnologyItem[];
  search: string;
  after: string;
  before: string;
}

export const ProjectFilter = ({
  projects,
  setFilteredProjects,
  filterState,
  setFilterState,
}: {
  projects: ProjectInfo[];
  setFilteredProjects: Dispatch<SetStateAction<ProjectInfo[]>>;
  filterState: FilterData;
  setFilterState: Dispatch<SetStateAction<FilterData>>;
}) => {
  const selectOptions = technologiesOptions.map((option) => {
    return { value: option, label: option };
  });

  useEffect(() => {
    const filterProjects = projects.filter((project) => {
      const technologiesMatch =
        filterState.technologies.length === 0 ||
        filterState.technologies.some((technology) => {
          return project.technologies.includes(technology.value);
        });
      if (!technologiesMatch) return false;
      const searchMatch =
        project.title
          .toLowerCase()
          .includes(filterState.search.toLowerCase()) ||
        project.description
          .toLowerCase()
          .includes(filterState.search.toLowerCase());

      if (!searchMatch) return false;

      const afterMatch =
        filterState.after === "" || project.date >= filterState.after;

      const beforeMatch =
        filterState.before === "" || project.date <= filterState.before;

      return technologiesMatch && searchMatch && afterMatch && beforeMatch;
    });
    setFilteredProjects(filterProjects);
    console.log(filterProjects);
  }, [filterState]);

  return (
    <div>
      <Accordion
        type="single"
        collapsible
        className="z-0 mb-4 w-full text-white"
      >
        <AccordionItem className="z-0 border-b-0" value="item-1">
          <AccordionTrigger>Filter</AccordionTrigger>
          <AccordionContent asChild className="z-0 overflow-visible">
            <div className="flex flex-row flex-wrap gap-3">
              <div>
                <p>Search Text</p>
                <Input
                  type="text"
                  onChange={(e) => {
                    setFilterState({ ...filterState, search: e.target.value });
                  }}
                  value={filterState.search}
                  placeholder="Search..."
                />
              </div>
              <div>
                <p>Technologies</p>
                <Select
                  value={filterState.technologies}
                  closeMenuOnSelect={false}
                  isMulti
                  name="colors"
                  styles={customStyles}
                  options={selectOptions}
                  className="bg-background"
                  classNamePrefix="select"
                  onChange={(e) => {
                    setFilterState({
                      ...filterState,
                      technologies: [...e],
                    });
                  }}
                />
              </div>
              <div>
                <p>After</p>
                <Input
                  type="date"
                  className="text-white"
                  placeholder="Search..."
                  value={filterState.after}
                  onChange={(e) => {
                    setFilterState({
                      ...filterState,
                      after: e.target.value,
                    });
                  }}
                />
              </div>
              <div>
                <p>Before</p>
                <Input
                  type="date"
                  placeholder="Search..."
                  value={filterState.before}
                  onChange={(e) => {
                    setFilterState({
                      ...filterState,
                      before: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
