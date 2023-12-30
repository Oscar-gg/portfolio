import React from "react";

export const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="my-2 flex flex-col px-10">
      <div>
        <h2 className="mb-4 text-4xl font-bold text-secondary">{title}</h2>
        <hr className="solid mb-3" />
        {children}
      </div>
    </div>
  );
};
