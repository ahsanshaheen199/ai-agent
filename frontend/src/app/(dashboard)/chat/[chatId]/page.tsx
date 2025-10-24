import { Chat } from "@/components/chat";
import { getChatById } from "@/queries/chat";

export default async function SingleChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;
  const { data } = await getChatById(chatId);
  const { chat } = data;
  const initialMessages = chat?.messages ?? [];

  return (
    <Chat key={chatId} chatId={chatId} initialMessages={initialMessages} />
  );
}
