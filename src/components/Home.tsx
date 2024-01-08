import {
  type MutableRefObject,
  type RefObject,
  useRef,
  useEffect,
} from "react";
import { ContactList } from "./List/contactList";

const handleMouseEnter = (
  key: string,
  refs: RefObject<Record<string, RefObject<HTMLSpanElement>>>,
  prev: MutableRefObject<string>,
) => {
  if (key !== prev.current) {
    prev.current = key;

    for (const item in refs.current) {
      if (item !== key) {
        refs?.current?.[item]?.current?.classList.add("text-white");
        refs?.current?.[item]?.current?.classList.remove("text-palette-blue");
      } else {
        refs?.current?.[item]?.current?.classList.remove("text-white");
        refs?.current?.[item]?.current?.classList.add("text-palette-blue");
      }
    }
  }
};

export const Home = () => {
  const letterRefs = useRef<Record<string, RefObject<HTMLSpanElement>>>({});
  const pastLetter = useRef<string>("");

  return (
    <div>
      <div className="flex flex-col items-center h-[92vh] justify-center">
        <h2 className="text-2xl text-secondary">Hi, I'm</h2>
        <h2 className="mb-10 text-center text-5xl text-secondary">
          <div
            className="group inline"
            onMouseEnter={() => handleMouseEnter("O", letterRefs, pastLetter)}
          >
            <span
              ref={(ref) => {
                letterRefs.current.O = { current: ref };
              }}
              className="text-7xl text-palette-blue duration-500"
            >
              O
            </span>
            scar{" "}
          </div>
          <div
            className="group inline "
            onMouseEnter={() => handleMouseEnter("A", letterRefs, pastLetter)}
          >
            <span
              className="text-7xl duration-500 "
              ref={(ref) => {
                letterRefs.current.A = { current: ref };
              }}
            >
              A
            </span>
            rreola{" "}
          </div>
          <div
            className="group inline"
            onMouseEnter={() => handleMouseEnter("A2", letterRefs, pastLetter)}
          >
            <span
              className="text-7xl duration-500 "
              ref={(ref) => {
                letterRefs.current.A2 = { current: ref };
              }}
            >
              A
            </span>
            lvarado
          </div>
        </h2>

        <div className="flex flex-row gap-x-4 gap-y-4 ">
          <a href="/pdfs/Oscar_Arreola_Resume.pdf" target="_blank">
            <button className="group rounded-lg bg-white p-2 text-lg font-semibold">
              Resume
            </button>
          </a>
          <ContactList />
        </div>
      </div>
    </div>
  );
};
