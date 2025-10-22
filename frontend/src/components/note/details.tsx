import { useNote } from "@/hooks/use-note";
import { Note } from "@/types";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { SheetFooter } from "../ui/sheet";
import { Input } from "../ui/input";
import { Field, FieldGroup } from "../ui/field";
import { FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { useUpdateNote } from "@/hooks/use-update-note";

export const NoteDetails = ({ noteId }: { noteId: string }) => {
  const { data: note, isPending: isLoading } = useNote(noteId);
  const [noteData, setNoteData] = useState<
    Omit<Note, "id" | "createdAt" | "updatedAt">
  >({
    title: "",
    content: "",
  });

  const { mutate: updateNote, isPending } = useUpdateNote();

  const handleUpdate = () => {
    updateNote({ note: noteData, id: noteId });
  };

  useEffect(() => {
    if (note) {
      setNoteData({
        title: note.title,
        content: note.content,
      });
    }
  }, [note]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[20vh]">
        <Loader2Icon className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="grid flex-1 auto-rows-min gap-6 px-4">
        <FieldGroup className="gap-5">
          <Field className="gap-2">
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Title"
              value={noteData.title}
              onChange={(e) =>
                setNoteData({ ...noteData, title: e.target.value })
              }
            />
          </Field>
          <Field className="gap-2">
            <FieldLabel htmlFor="content">Content</FieldLabel>
            <Textarea
              id="content"
              name="content"
              placeholder="Content"
              value={noteData.content}
              onChange={(e) =>
                setNoteData({ ...noteData, content: e.target.value })
              }
            />
          </Field>
        </FieldGroup>
      </div>
      <SheetFooter>
        <Button
          onClick={handleUpdate}
          disabled={isPending || !noteId || !noteData.content}
          className="rounded-full px-10! !text-lg! cursor-pointer disabled:opacity-75"
          size="lg"
        >
          {isPending && <Loader2Icon className="w-7! h-7! animate-spin" />}
          Save Changes
        </Button>
      </SheetFooter>
    </>
  );
};
