"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "../ui/sidebar";
import { AppLogo } from "../logo";
import { NavMenus } from "./nav-menus";
import { NavUser } from "./nav-user";
import { NavNotes } from "./nav-notes";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className="z-99">
      <SidebarHeader>
        <div className="w-full flex items-center justify-between">
          <AppLogo url="/home" />
          <SidebarTrigger className="-ms-4" />
        </div>
        <hr className="border-border mx-2 -mt-px" />
        {/* {Search Button} */}
      </SidebarHeader>
      <SidebarContent className="px-2 pt-2 overflow-x-hidden">
        <NavMenus />
        <NavNotes />
      </SidebarContent>
      <SidebarFooter>
        <hr className="border-border mx-2 -mt-px" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
