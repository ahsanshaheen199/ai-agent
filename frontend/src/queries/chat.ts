import { cookies } from "next/headers";

export const getChatById = async (chatId: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/${chatId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("response", response);

  return response.json();
};
