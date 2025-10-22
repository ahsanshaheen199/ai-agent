import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../ui/sidebar";
import { FileTextIcon, Loader2Icon, PlusIcon } from "lucide-react";
import { useNotes } from "@/hooks/use-notes";
import { useCreateNote } from "@/hooks/use-create-note";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const NavNotes = () => {
  const { data: notes, isPending } = useNotes();
  const { mutate: createNote, isPending: isLoading } = useCreateNote();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const noteId = searchParams.get("noteId");
  const router = useRouter();

  return (
    <>
      {isLoading && (
        <div
          className="fixed inset-0 bg-background/20 backdrop-blur-xs z-50
    flex items-center justify-center
  "
        >
          <div className="flex flex-col items-center gap-2">
            <Loader2Icon className="w-16 h-16 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Creating notes...</p>
          </div>
        </div>
      )}
      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center justify-between">
          <h5>Notes</h5>
          <SidebarGroupAction
            onClick={() => {
              createNote({
                title: "New Note",
                content: "New Note Content",
              });
            }}
            className="flex items-center size-5 rounded-md bg-primary/20 border cursor-pointer"
          >
            <PlusIcon size={16} />
            <span className="sr-only">Add Notes</span>
          </SidebarGroupAction>
        </SidebarGroupLabel>
        <SidebarGroupContent className="w-full h-auto min-h-32 max-h-[360px] overflow-y-auto">
          <SidebarMenu>
            {notes?.notes?.length === 0 ? (
              <div>No Notes</div>
            ) : isPending ? (
              <div className="flex items-center justify-center">
                <Loader2Icon className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              notes?.notes?.map((note) => {
                const isActive = note.id === noteId;
                return (
                  <SidebarMenuItem key={note.id}>
                    <SidebarMenuButton
                      className="flex items-center w-full cursor-pointer"
                      isActive={isActive}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set("noteId", note.id);
                        router.push(`${pathname}?${params.toString()}`, {
                          scroll: false,
                        });
                      }}
                    >
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <FileTextIcon className="w-4 h-4 text-primary" />
                      </span>
                      <h5 className="flex-1 truncate">{note.title}</h5>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};
