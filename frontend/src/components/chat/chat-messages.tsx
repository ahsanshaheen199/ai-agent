import { AlertCircleIcon } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "../ai-elements/conversation";
import { ChatStatus, type UIMessage } from "ai";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Loader } from "../ai-elements/loader";
import { PreviewMessage } from "./preview-message";
import { useStickToBottom } from "use-stick-to-bottom";
import { useEffect } from "react";

type ChatMessagesProps = {
  messages: UIMessage[];
  status: ChatStatus;
  error?: Error;
};

export const ChatMessages = ({
  messages,
  status,
  error,
}: ChatMessagesProps) => {
  const { scrollRef, contentRef, scrollToBottom } = useStickToBottom();

  useEffect(() => {
    if (messages || status === "submitted" || status === "ready") {
      scrollToBottom();
    }
  }, [messages, status, scrollToBottom]);

  return (
    <div ref={scrollRef} className="overflow-y-auto h-auto">
      <Conversation className="h-full">
        <ConversationContent>
          {messages.length === 0 && (
            <div className="w-full h-full md:mt-3 px-2 flex flex-col">
              <div className="text-2xl font-semibold opacity-0 fade-in-up [animation-delay:200ms]">
                Hello there!
              </div>
              <div className="text-2xl  text-zinc-500 opacity-0 fade-in-up [animation-delay:400ms]">
                How can I help you today?
              </div>
            </div>
          )}

          {/* {Preview Message} */}
          {messages?.map((message, index) => (
            <PreviewMessage
              key={message.id}
              message={message}
              isLoading={
                status === "streaming" && messages.length - 1 === index
              }
            />
          ))}

          {status === "submitted" &&
            messages.length > 0 &&
            messages[messages.length - 1]?.role === "user" && <Loader />}

          {status === "streaming" &&
            messages.length > 0 &&
            messages[messages.length - 1]?.role === "assistant" && <Loader />}

          {status === "error" && error && (
            <Alert
              variant="destructive"
              className="w-full bg-destructive/20 border-destructive/50"
            >
              <AlertCircleIcon className="h-4 w-4" />
              <div>
                <AlertTitle>Chat Error</AlertTitle>
                <AlertDescription className="whitespace-break-spaces">
                  <p>{error.message ?? "Something went wrong"}</p>
                </AlertDescription>
              </div>
            </Alert>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div ref={contentRef} />
    </div>
  );
};
