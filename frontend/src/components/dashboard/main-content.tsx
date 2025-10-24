"use client";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export const MainContent = ({ children }: Props) => {
  return (
    <>
      <div className="flex flex-col flex-1">{children}</div>
    </>
  );
};
