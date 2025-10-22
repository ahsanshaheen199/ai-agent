"use client";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export const MainContent = ({ children }: Props) => {
  return (
    <>
      <div className="relative w-full h-auto overflow-hidden">{children}</div>
    </>
  );
};
