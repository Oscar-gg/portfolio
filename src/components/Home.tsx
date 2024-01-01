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

const handleResize = (
  elements: RefObject<Record<string, HTMLDivElement>>,
  navBarHeight: number,
) => {
  const screenHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  if (elements.current) {
    let containerSize = 0;
    if (elements.current["content"]) {
      containerSize = elements.current["content"].clientHeight;
    }
    const spacerSize = (screenHeight - containerSize) / 2;
    if (elements.current["top"]) {
      if (spacerSize - navBarHeight >= 0)
        elements.current["top"].style.height = `${spacerSize - navBarHeight}px`;
    }
    if (elements.current["bottom"]) {
      elements.current["bottom"].style.height = `${spacerSize}px`;
    }
  }
};

export const Home = ({ navBarHeight = 0 }: { navBarHeight?: number }) => {
  const letterRefs = useRef<Record<string, RefObject<HTMLSpanElement>>>({});
  const pastLetter = useRef<string>("");
  const spacerRef = useRef<Record<string, HTMLDivElement>>({});

  useEffect(() => {
    handleResize(spacerRef, navBarHeight);
    window.addEventListener("resize", () =>
      handleResize(spacerRef, navBarHeight),
    );
    return () => {
      window.removeEventListener("resize", () =>
        handleResize(spacerRef, navBarHeight),
      );
    };
  }, [spacerRef, navBarHeight]);

  return (
    <div>
      <div
        ref={(ref) => {
          if (ref) spacerRef.current["top"] = ref;
        }}
      ></div>
      <div
        ref={(ref) => {
          if (ref) spacerRef.current["content"] = ref;
        }}
        className="bg-background flex flex-col justify-start align-top"
      >
        <h2 className="mb-2 ml-[20%] text-2xl text-secondary">Hi, I'm</h2>
        <h2 className="mb-10 ml-[20%] text-5xl text-secondary">
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
            className="group inline"
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

        <div className="ml-[20%] flex flex-row gap-x-4 gap-y-4 ">
          <a href="/pdfs/Oscar_Arreola_Resume.pdf" target="_blank">
            <button className="group rounded-lg bg-white p-2 text-lg font-semibold">
              Resume
            </button>
          </a>
          <ContactList />
        </div>
      </div>
      <div
        ref={(ref) => {
          if (ref) spacerRef.current["bottom"] = ref;
        }}
      ></div>
    </div>
  );
};
