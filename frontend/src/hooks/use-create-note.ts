import { useMutation } from "@tanstack/react-query";
import { Note } from "@/types";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notes`,
        {
          method: "POST",
          body: JSON.stringify(note),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      const result = (await response.json()) as { data: { note: Note } };

      return result.data.note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to create note");
    },
  });
};
