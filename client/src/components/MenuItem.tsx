import { DynamicIcon } from "lucide-react/dynamic";
import { NavLink, useLocation } from "react-router-dom";

import { ChevronRight } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@components/ui/sidebar";

import type { MenuItem } from "@lib/types";

export default function MenuItem(menuItem: MenuItem) {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();

  const handleOpenSidebar = () => {
    if (state === "collapsed") {
      toggleSidebar();
    }
  };

  if (menuItem.items?.length) {
    return (
      <Collapsible asChild defaultOpen={menuItem.isActive} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={menuItem.title}
              onClick={handleOpenSidebar}
              className="cursor-pointer"
            >
              {!!menuItem.icon && <DynamicIcon name={menuItem.icon} size={32} />}
              {state === "expanded" && (
                <>
                  <span>{menuItem.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </>
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub className="flex-col gap-3 pt-2">
              {menuItem.items?.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    className={
                      subItem.url === location.pathname
                        ? "text-primary pointer-events-none transition-[opacity] duration-200 linear hover:text-primary"
                        : "hover:opacity-75"
                    }
                  >
                    <NavLink to={subItem.url}>
                      <span>{subItem.title}</span>
                    </NavLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={menuItem.title}
        className={
          menuItem.url === location.pathname
            ? "text-primary pointer-events-none transition-[opacity] duration-200 linear hover:text-primary"
            : "hover:opacity-75"
        }
      >
        <NavLink to={menuItem.url}>
          {!!menuItem.icon && <DynamicIcon name={menuItem.icon} />}
          <span className="text-base">{menuItem.title}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
