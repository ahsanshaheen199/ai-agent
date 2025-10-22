"use client";

import React from "react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { History, PlusIcon } from "lucide-react";

type Props = {
  title?: string;
  showActions?: boolean;
};

export const Header = ({ title, showActions = false }: Props) => {
  const router = useRouter();
  const { open, isMobile } = useSidebar();

  const onClick = () => {
    router.push("/chat");
  };
  return (
    <header
      className="fixed top-0 inset-0 z-9 h-[40px]
      flex items-center px-2  md:px-8 py-1 bg-background/20 backdrop-blur-sm"
    >
      {(!open || isMobile) && <SidebarTrigger className="h-10" />}

      {!showActions && title && (
        <div
          className={cn(
            "pt-5",
            open && "w-full max-w-full! lg:p-[10px_0_0_250px]"
          )}
        >
          <h2 className="text-xl lg:text-2xl font-semibold">{title}</h2>
        </div>
      )}

      {showActions && (
        <div
          className={cn(
            "w-full flex items-center justify-between",
            open && "w-full max-w-full! lg:p-[0_0_0_250px]!"
          )}
        >
          <h2>{title}</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer bg-muted/10!"
              onClick={onClick}
            >
              <PlusIcon size={16} />
              New Chat
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer bg-muted/10!"
              onClick={() => {}}
            >
              <History size={16} />
              Chat history
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
