import { Note } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ note, id }: { note: Partial<Note>; id: string }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notes/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(note),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      const result = (await response.json()) as { data: { note: Note } };
      return result.data.note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note updated successfully");
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to update note");
    },
  });
};
