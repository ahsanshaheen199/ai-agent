"use server";

import { cookies } from "next/headers";

export async function signout() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  return {
    success: true,
  };
}
