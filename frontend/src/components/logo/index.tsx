import Link from "next/link";
import Image from "next/image";

export function AppLogo({ url = "/" }: { url?: string }) {
  return (
    <Link href={url} className="w-fit flex items-center  gap-2">
      <div
        className="flex aspect-square size-8 items-center justify-center rounded-md overflow-hidden text-primary-foreground
    "
      >
        <Image src="/logo.svg" width={36} height={36} alt="Ai Agent" />
      </div>

      <div className="flex-1 text-left text-base leading-tight">
        <span className="font-medium">Ai Agent</span>
      </div>
    </Link>
  );
}
