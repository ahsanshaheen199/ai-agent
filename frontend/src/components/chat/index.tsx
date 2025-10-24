"use client";

import { useAuthToken } from "@/hooks/use-auth-token";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { ulid } from "ulid";
import { DefaultChatTransport, UIMessage } from "ai";
import { ChatInput } from "./chat-input";
import { DEFAULT_CHAT_MODEL_ID } from "@/lib/models";
import { ChatMessages } from "./chat-messages";

type ChatProps = {
  chatId: string;
  initialMessages: UIMessage[];
};

export function Chat({ chatId, initialMessages }: ChatProps) {
  const token = useAuthToken();
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, stop, error } = useChat({
    id: chatId,
    generateId: () => ulid(),
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAxSzgzTjVLTUdYWURQNDNLWks2NENUUUgyIiwiaWF0IjoxNzYxMTEyMjk0LCJleHAiOjE3NjE3MTcwOTR9.KaiL1hjbDwsTg8R2RXRSBaGiMlI_5kA_KAPxLBZYyxM`,
      },
      prepareSendMessagesRequest: ({ messages, id, body }) => {
        return {
          body: {
            id,
            message: messages[messages.length - 1],
            selectedModelId: DEFAULT_CHAT_MODEL_ID,
            selectedToolName: body?.selectedToolName || null,
          },
        };
      },
    }),
  });

  return (
    <div className="flex flex-col h-screen min-w-0 overflow-x-hidden bg-background">
      <div className="flex-1">
        <ChatMessages messages={messages} status={status} error={error} />
      </div>

      <div className="sticky bottom-1 inset-y-1 flex gap-2 px-4 pb-1 mt-2 w-full bg-background z-1">
        <div className="w-full relative mx-auto md:max-w-3xl">
          <ChatInput
            chatId={chatId}
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
            stop={stop}
            status={status}
            initialModelId={DEFAULT_CHAT_MODEL_ID}
          />
        </div>
      </div>
    </div>
  );
}
