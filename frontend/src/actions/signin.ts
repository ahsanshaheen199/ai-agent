"use server";

import { User } from "@/types";
import { z } from "zod";
import { cookies } from "next/headers";

type SuccessResponse = {
  message: string;
  data: { user: User; token: string };
};

type ErrorResponse = {
  message: string;
};

export async function signin(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const schema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  });

  const parsedResult = schema.safeParse({
    email,
    password,
  });

  if (!parsedResult.success) {
    return {
      errors: parsedResult.error.issues.reduce((acc, curr) => {
        acc[curr.path[0] as string] = curr.message;
        return acc;
      }, {} as Record<string, string>),
    };
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
    {
      method: "POST",
      body: JSON.stringify(parsedResult.data),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  const result = (await response.json()) as SuccessResponse | ErrorResponse;

  if (!response.ok) {
    return {
      error: result.message,
    };
  }

  const token = (result as SuccessResponse).data.token;

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 60 * 60 * 24 * 7),
    sameSite: "lax",
  });

  return {
    success: true,
    token,
  };
}
