"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { NoteDetails } from "./details";

export const NoteDialog = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const noteId = searchParams.get("noteId");
  const router = useRouter();
  const isOpen = noteId !== null;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      const params = new URLSearchParams(searchParams);
      params.delete("noteId");
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="">
        <SheetHeader className="py-2 border-b bg-muted px-4">
          <SheetTitle>Edit Note</SheetTitle>
        </SheetHeader>

        {noteId && <NoteDetails noteId={noteId} />}
      </SheetContent>
    </Sheet>
  );
};
