import { UseChatHelpers } from "@ai-sdk/react";
import { Dispatch, SetStateAction, useState } from "react";
import { ChatStatus, UIMessage } from "ai";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "../ai-elements/prompt-input";
import { ModelSelector } from "./model-selector";
import { useChatStore } from "@/hooks/use-chat-store";
import { ChatAvailableTools } from "./chat-available-tools";
import { AvailableToolType } from "@/lib/tools";
import { ArrowUpIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

type ChatInputProps = {
  chatId: string;
  initialModelId: string;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  sendMessage: UseChatHelpers<UIMessage>["sendMessage"];
  stop: () => void;
  status: ChatStatus;
};

export function ChatInput({
  chatId,
  initialModelId,
  input,
  setInput,
  sendMessage,
  stop,
  status,
}: ChatInputProps) {
  const { localModelId, setLocalModelId } = useChatStore();
  const [selectedTool, setSelectedTool] = useState<AvailableToolType | null>(
    null
  );
  const isGenerating = status === "streaming" || status === "submitted";

  const selectedModelId = localModelId || initialModelId;

  const handleSubmit = () => {
    if (!input.trim()) {
      return;
    }

    if (status === "streaming") {
      toast.error(
        "Please wait for the current response to finish or stop it first!"
      );
      return;
    }

    sendMessage(
      {
        role: "user",
        parts: [
          {
            type: "text",
            text: input,
          },
        ],
      },
      {
        body: {
          selectedModelId: selectedModelId,
          selectedToolName: selectedTool?.name || null,
        },
      }
    );
    setInput("");

    window.history.replaceState({}, "", `/chat/${chatId}`);
  };

  return (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputBody className="relative">
        {selectedTool && (
          <div className="pt-1.5">
            <div className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium border">
              <selectedTool.icon size={12} />
              <span>{selectedTool.name}</span>
              <button
                className="ml-1 hover:bg-primary/20 rounded-sm p-0.5 transition-colors"
                onClick={() => setSelectedTool(null)}
              >
                <XIcon size={10} />
              </button>
            </div>
          </div>
        )}
        <PromptInputTextarea
          placeholder="Ask, search or create note.."
          rows={2}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools>
          <ModelSelector
            selectedModelId={selectedModelId}
            onSelect={(value) => {
              setLocalModelId(value);
            }}
          />
          <ChatAvailableTools
            onSelectTool={(tool) => {
              setSelectedTool(tool);
            }}
          />
        </PromptInputTools>
        {isGenerating ? (
          <Button size="icon" onClick={stop}>
            <svg height={25} viewBox="0 0 16 16" width={25}>
              <path
                clipRule="evenodd"
                d="M3 3H13V13H3V3Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </Button>
        ) : (
          <PromptInputSubmit status={status} disabled={!input.trim()}>
            <ArrowUpIcon />
          </PromptInputSubmit>
        )}
      </PromptInputFooter>
    </PromptInput>
  );
}
