"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { signup } from "@/actions/signup";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      localStorage.setItem("token", state.token);
      router.replace("/home");
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state?.error && (
          <div className="text-destructive text-sm font-normal">
            {state.error}
          </div>
        )}
        <form action={formAction}>
          <FieldGroup className="gap-5">
            <Field className="grid grid-cols-2 gap-2">
              <Field className="gap-2">
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John Doe"
                  name="firstName"
                />
                {state?.errors?.firstName && (
                  <FieldError errors={[{ message: state.errors.firstName }]} />
                )}
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="John Doe"
                  name="lastName"
                />
                {state?.errors?.lastName && (
                  <FieldError errors={[{ message: state.errors.lastName }]} />
                )}
              </Field>
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                name="email"
              />
              {state?.errors?.email && (
                <FieldError errors={[{ message: state.errors.email }]} />
              )}
            </Field>
            <Field className="gap-2">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" name="password" />
              {state?.errors?.password && (
                <FieldError errors={[{ message: state.errors.password }]} />
              )}
            </Field>
            <Field className="gap-2">
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
              />
              {state?.errors?.confirmPassword && (
                <FieldError
                  errors={[{ message: state.errors.confirmPassword }]}
                />
              )}
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Loader2 className="animate-spin" /> : null}{" "}
                  {isPending ? "Creating account..." : "Create Account"}
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/sign-in">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
