import { FaGithub } from "react-icons/fa";
import { TiSocialLinkedinCircular } from "react-icons/ti";

import { IoMail } from "react-icons/io5";
import { type MutableRefObject, type RefObject, useRef } from "react";

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
    <div className="bg-background my-56 flex flex-col">
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
        <button className="group rounded-lg bg-white p-2 text-lg font-semibold">
          {" "}
          Resume
        </button>
        <FaGithub
          className="animate-pulseButton rounded-full"
          color="white"
          size="40"
        />
        <TiSocialLinkedinCircular
          className="animate-pulseButton rounded-full"
          color="white"
          size="40"
        />
        <IoMail className="animate-pulseButton" color="white" size="40" />
      </div>
    </div>
  );
};
