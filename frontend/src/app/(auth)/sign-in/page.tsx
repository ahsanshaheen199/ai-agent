import { AppLogo } from "@/components/logo";
import { SignInForm } from "@/components/auth/signin-form";

export default function SignInPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="relative flex w-full max-w-sm flex-col gap-6">
        <div className="w-full flex items-center justify-center">
          <AppLogo />
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
