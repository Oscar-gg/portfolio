import { twMerge } from "tailwind-merge";

interface IconListElement {
  image: string;
  title: string;
  description: string;
}

export const IconList = ({
  list,
  className,
}: {
  list: IconListElement[];
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        "grid grid-cols-2 flex-row  flex-wrap gap-3 rounded-md lg:grid-cols-4",
        className,
      )}
    >
      {list.map((element) => (
        <div
          className="flex flex-row gap-x-2 rounded-md bg-black p-2"
          key={element.title}
        >
          <img
            className="h-28 w-28 rounded-full"
            src={element.image}
            alt={element.title}
          />
          <div className="flex w-full flex-col items-center justify-between align-middle text-white">
            <h3 className="text-xl md:text-3xl mt-8">{element.title}</h3>
            <p>{element.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
