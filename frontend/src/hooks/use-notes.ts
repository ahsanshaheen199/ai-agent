import { useQuery } from "@tanstack/react-query";
import { Note } from "@/types";
import { Pagination } from "@/types";

export const useNotes = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["notes", page, limit],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notes?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const result = (await response.json()) as {
        data: { notes: Note[]; pagination: Pagination };
      };

      return result.data;
    },
  });
};
