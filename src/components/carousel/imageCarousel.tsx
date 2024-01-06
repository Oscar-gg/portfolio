import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "~/components/ui/carousel";
import { Card, CardContent } from "~/components/ui/card";

import { type ImageInfo } from "~/components/card/experienceCard";

export const ImageCarousel = ({ images }: { images: ImageInfo[] }) => {
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
    });
  }, [api]);

  return (
    <div className="m-2 h-full w-full ">
      <Carousel setApi={setApi} className="h-full w-full">
        <CarouselContent className="h-full w-full">
          {images.map((image) => (
            <CarouselItem
              className="h-full max-h-full w-full max-w-full bg-background"
              key={image.path}
            >
              <Card
                style={{ backgroundImage: `url('${image.path}')` }}
                className="relative h-full max-h-full bg-background w-full max-w-full bg-contain bg-center bg-no-repeat"
              >
                <p className="absolute p-2 bottom-0 left-[50%] translate-x-[-50%] rounded-md bg-background text-center text-white">
                  {" "}
                  {image.description}
                </p>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-white" />
        <CarouselNext className="text-white" />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
    </div>
  );
};
