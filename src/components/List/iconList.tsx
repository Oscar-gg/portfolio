import { twMerge } from "tailwind-merge";
import { cn } from "~/utils/utils";

interface IconListElement {
  image: string;
  title: string;
  description?: string;
}

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

const IconItem = ({
  element,
  size,
}: {
  element: IconListElement;
  size: string;
}) => (
  <div
    className="flex flex-row items-center gap-x-2 rounded-md bg-black p-2"
    key={element.title}
  >
    <img
      className={cn(
        "h-28 w-auto ",
        size === "small" && "h-16  w-auto",
        size === "medium" && "h-28  w-auto",
        size === "large" && "h-36  w-auto",
      )}
      src={element.image}
      alt={element.title}
    />
    <div className="m-5 flex w-full flex-col items-center justify-between align-middle text-white">
      <h3 className="text-3xl">{element.title}</h3>
      {element.description && <p>{element.description}</p>}
    </div>
  </div>
);

export const IconList = ({
  list,
  className,
  size = "medium",
  maxItems = 4,
  accordionMessage = "Details",
}: {
  list: IconListElement[];
  className?: string;
  size?: "small" | "medium" | "large";
  maxItems?: number;
  accordionMessage?: string;
}) => {
  const displayItems = list.slice(0, maxItems);
  const detailItems = list.slice(maxItems);

  return (
    <div>
      <div
        className={cn(
          "grid grid-cols-1 flex-row flex-wrap gap-3 rounded-md sm:grid-cols-2 lg:grid-cols-3",
          size === "small" && "md:flex",
          className,
        )}
      >
        {displayItems.map((element) => (
          <IconItem key={element.title} element={element} size={size} />
        ))}
      </div>
      {detailItems.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem className="border-b-0 text-white" value="list-details">
            <AccordionTrigger>
              {accordionMessage} ({detailItems.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-row flex-wrap gap-3">
                {detailItems.map((element) => (
                  <IconItem key={element.title} element={element} size={size} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};
