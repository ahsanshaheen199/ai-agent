import { useQuery } from "@tanstack/react-query";
import { Note } from "@/types";

export const useNote = (id: string) => {
  return useQuery({
    queryKey: ["notes", "details", id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notes/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch note");
      }

      const result = (await response.json()) as { data: { note: Note } };
      return result.data.note;
    },
    enabled: !!id,
  });
};
