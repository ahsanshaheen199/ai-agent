import { Chat } from "@/components/chat";
import { ulid } from "ulid";

export default function ChatPage() {
  const chatId = ulid();

  return <Chat key={chatId} chatId={chatId} initialMessages={[]} />;
}
