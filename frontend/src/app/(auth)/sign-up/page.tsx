import { SignupForm } from "@/components/auth/signup-form";
import { AppLogo } from "@/components/logo";

export const metadata = {
  title: "Create an account",
  description: "Enter your information below to create your account",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="relative flex w-full max-w-sm flex-col gap-6">
        <div className="w-full flex items-center justify-center">
          <AppLogo />
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
