import { UIMessage } from "ai";
import { Message, MessageContent } from "../ai-elements/message";
import { cn } from "@/lib/utils";
import { Response } from "../ai-elements/response";
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "../ai-elements/reasoning";
import { ToolTypeEnum } from "@/lib/tools";
import { ToolCall } from "./tool-call";

type PreviewMessageProps = {
  message: UIMessage;
  isLoading: boolean;
};

export const PreviewMessage = ({ message, isLoading }: PreviewMessageProps) => {
  return (
    <Message
      className={cn(message.role !== "user" && "max-w-full!")}
      key={message.id}
      from={message.role}
    >
      <MessageContent
        className={cn(
          "text-[15.5px] dark:text-white",
          message.role !== "user"
            ? "w-full! max-w-full! px-1! pb-0! bg-transparent! m-0! min-h-0!"
            : "bg-muted! p-2.5! text-[14.5px] text-foreground!"
        )}
      >
        {message.parts.map((part, i) => {
          switch (part.type) {
            case "text": {
              return (
                <Response key={`${message.id}-${i}`}>{part.text}</Response>
              );
            }
            case "reasoning": {
              return (
                <Reasoning key={`${message.id}-reason-${i}`}>
                  <ReasoningTrigger />
                  <ReasoningContent>{part.text}</ReasoningContent>
                </Reasoning>
              );
            }

            case ToolTypeEnum.CreateNote: {
              return <ToolCall />;
            }
            case ToolTypeEnum.SearchNote: {
              return <ToolCall />;
            }

            default:
              return null;
          }
        })}
      </MessageContent>
    </Message>
  );
};
