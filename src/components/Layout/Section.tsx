import React from "react";

export const Section = React.forwardRef(
  (
    {
      title,
      children,
      id,
    }: { title: string; children: React.ReactNode; id: string },
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <div className="mb-16 flex flex-col px-10 lg:w-[80%] mr-auto ml-auto p-2" ref={ref} id={id}>
        <div>
          <h2 className="mb-4 text-4xl font-bold text-secondary">{title}</h2>
          <hr className="solid mb-3" />

          {children}
        </div>
      </div>
    );
  },
);
