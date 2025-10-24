"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCreateNote } from "@/hooks/use-create-note";
import { useNotes } from "@/hooks/use-notes";
import { FileTextIcon, Loader2Icon, PlusIcon } from "lucide-react";
import { Note } from "@/types";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { Input } from "../ui/input";
import { ulid } from "ulid";
import { useAuthToken } from "@/hooks/use-auth-token";

export const RecentNotes = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data, isPending: isLoading } = useNotes(1, 8);
  const { mutate, isPending } = useCreateNote();
  const [input, setInput] = useState("");
  const token = useAuthToken();
  const onCreate = () => {
    mutate({
      title: "Untitled",
      content: "",
    });
  };

  const { sendMessage, messages } = useChat({
    generateId: () => {
      return ulid();
    },
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      prepareSendMessagesRequest({ messages, id }) {
        return {
          body: {
            id,
            message: messages.at(-1),
          },
        };
      },
    }),
  });

  const handleSendMessage = () => {
    if (!input.trim()) return;
    sendMessage({
      parts: [{ type: "text", text: input }],
    });
    setInput("");
  };

  console.log("id", ulid());

  console.log("messages", messages);

  return (
    <div className="w-full mt-1.5">
      <div className="w-full flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
      </div>
      <ul className="flex w-full  flex-col gap-2">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2Icon className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : data?.notes?.length === 0 ? (
          <div className="text-center py-12">
            <FileTextIcon
              className={cn("w-18 h-8 text-muted-foreground mx-auto mb-4")}
            />
            <h3 className="text-lg font-medium mb-3">No notes yet</h3>

            <Button
              onClick={onCreate}
              className="cursor-pointer"
              disabled={isPending}
            >
              <PlusIcon className="w-5 h-5 mr-1" />
              Create Note
              {isPending && <Loader2Icon className="w-4 h-4 animate-spin" />}
            </Button>
          </div>
        ) : (
          data?.notes?.map((note: Note) => {
            return (
              <li key={note.id} className="relative">
                <button
                  className="flex w-full items-center gap-2 py-1 text-sm dark:text-white/80 text-left hover:bg-accent rounded-sm"
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
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};
