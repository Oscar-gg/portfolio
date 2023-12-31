import { Section } from "~/components/Layout/Section";

import { experience } from "~/data/typed/objects";

import { Card, CardContent } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "~/components/ui/carousel";
import { RefObject, useEffect, useRef, useState } from "react";
import { ExperienceCard } from "./card/experienceCard";
import { Button } from "./ui/button";
import { twMerge } from "tailwind-merge";

const handleSelected = ({
  index,
  buttonReferences,
}: {
  index: number;
  buttonReferences: RefObject<HTMLButtonElement[]>;
}) => {
  if (!buttonReferences?.current) return;
  for (let i = 0; i < buttonReferences.current.length; i++) {
    if (i === index) {
      buttonReferences.current[i]?.classList.add("border-2");
    } else {
      buttonReferences.current[i]?.classList.remove("border-2");
    }
  }
};

export const Experience = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
      handleSelected({ index: api.selectedScrollSnap(), buttonReferences });
    });
  }, [api]);

  const experienceNames = experience.map((element) => element.title);
  const buttonReferences = useRef<HTMLButtonElement[]>([]);

  return (
    <Section title="Experience">
      <div>
        <div className="my-4 flex flex-row flex-wrap items-center gap-3">
          {experienceNames.map((element, index) => (
            <Button
              onClick={() => api?.scrollTo(index)}
              key={element}
              ref={(ref) => {
                if (ref) buttonReferences.current[index] = ref;
              }}
              className={twMerge(
                "text-white duration-300 hover:bg-zinc-900",
                index === 0 && "border-2",
              )}
            >
              {element}
            </Button>
          ))}
        </div>
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {experience.map((element) => (
              <CarouselItem key={element.title}>
                <Card className="bg-black">
                  <CardContent>
                    <ExperienceCard {...element} />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </Section>
  );
};
