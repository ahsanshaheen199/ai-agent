import React from "react";
import { usePathname } from "next/navigation";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import {
  CogIcon,
  CreditCardIcon,
  HomeIcon,
  MessageCircleIcon,
} from "lucide-react";
import Link from "next/link";

export const NavMenus = () => {
  const pathname = usePathname();

  const mainMenus = [
    {
      label: "Home",
      href: "/home",
      icon: HomeIcon,
    },
    {
      label: "Chat",
      href: "/chat",
      icon: MessageCircleIcon,
    },
    {
      label: "Billing",
      href: "/billing",
      icon: CreditCardIcon,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: CogIcon,
    },
  ];

  return (
    <>
      <SidebarMenu>
        {mainMenus?.map((item) => {
          const isActive = pathname === item.href;

          return (
            <SidebarMenuItem
              key={item.label}
              className="relative flex flex-col items-stretch"
            >
              <SidebarMenuButton
                className="group/menu-button font-medium h-9 rounded-md bg-linear-to-r hover:bg-transparent hover:from-sidebar-accent
                hover:to-sidebar-accent/40 data-[active=true]:from-primary/20
                data-[active=true]:to-primary/5 [&>svg]:size-auto cursor-pointer "
                isActive={isActive}
                asChild
              >
                <Link href={item.href}>
                  <item.icon
                    className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                    size={22}
                  />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </>
  );
};
