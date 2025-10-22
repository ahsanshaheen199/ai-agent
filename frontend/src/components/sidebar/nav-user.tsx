import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { ChevronsUpDownIcon, LogOutIcon, Loader2Icon } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import { signout } from "@/actions/signout";
import { useState } from "react";

export const NavUser = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok || response.status === 401) {
        await onSignOut();
        return null;
      }

      const result = (await response.json()) as { data: { user: User } };
      return result.data.user;
    },
  });

  const onSignOut = async () => {
    setIsSigningOut(true);
    await signout();
    localStorage.removeItem("token");
    setIsSigningOut(false);
    router.replace("/sign-in");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {isLoading ? (
            <Loader2Icon className="w-5 h-5 animate-spin" />
          ) : (
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg border border-primary flex items-center justify-center">
                  <AvatarFallback className="rounded-lg">
                    {user?.firstName?.charAt(0) || user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="truncate font-medium">{user?.email}</span>
                </div>
                <ChevronsUpDownIcon className="size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          )}
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            onCloseAutoFocus={(e) => {
              if (isSigningOut) {
                e.preventDefault();
              }
            }}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg border border-primary flex items-center justify-center">
                  <AvatarFallback className="rounded-lg">
                    {user?.firstName?.charAt(0) || user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="truncate font-medium">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="relative"
              disabled={isSigningOut}
              onClick={onSignOut}
            >
              <LogOutIcon className="text-muted-foreground/60" />
              Log Out
              {isSigningOut && (
                <Loader2Icon className="w-4 h-4 absolute right-2 animate-spin" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
