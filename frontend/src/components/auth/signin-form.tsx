"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "../ui/field";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useActionState, useEffect } from "react";
import { signin } from "@/actions/signin";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export const SignInForm = () => {
  const [state, formAction, isPending] = useActionState(signin, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      localStorage.setItem("token", state.token);
      router.replace("/home");
    }
  }, [state]);

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state?.error && (
            <div className="text-destructive text-sm font-normal mb-4">
              {state.error}
            </div>
          )}
          <form action={formAction}>
            <FieldGroup className="gap-5">
              <Field className="gap-2">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                />
                {state?.errors?.email && (
                  <FieldError errors={[{ message: state.errors.email }]} />
                )}
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" name="password" type="password" />
                {state?.errors?.password && (
                  <FieldError errors={[{ message: state.errors.password }]} />
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Loader2 className="animate-spin" /> : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/sign-up">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
