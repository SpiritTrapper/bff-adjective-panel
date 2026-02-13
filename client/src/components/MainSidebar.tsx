import type { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import MenuItem from "@components/MenuItem";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  useSidebar,
} from "@components/ui/sidebar";

import { AppRoutes, type MenuItem as MItem } from "@lib/types";

import LogoMain from "@images/logo-main.svg";
import LogoMini from "@images/logo-mini.svg";

export default function MainSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const { t } = useTranslation("promo");

  const menuItems: MItem[] = [
    {
      title: t("promo:title"),
      url: "#",
      icon: "gem",
      items: [
        {
          title: t("promo:promoEvents"),
          url: `${AppRoutes.PROMO}/events`,
        },
        {
          title: t("promo:promoNews"),
          url: `${AppRoutes.PROMO}/news`,
        },
      ],
    },
    {
      title: t("events:title", { ns: "events" }),
      url: AppRoutes.EVENTS,
      icon: "tickets",
    },
    {
      title: t("news:title", { ns: "news" }),
      url: AppRoutes.NEWS,
      icon: "newspaper",
    },
  ];

  return (
    <Sidebar collapsible="icon" className="overflow-hidden" {...props}>
      <SidebarHeader className={state === "expanded" ? "p-4" : "p-3 pt-5"}>
        <NavLink to="/">
          {state === "expanded" ? (
            <LogoMain width={128} height={32} />
          ) : (
            <LogoMini width={26} height={18} />
          )}
        </NavLink>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="flex flex-col gap-3">
            {menuItems.map((item) => (
              <MenuItem key={item.title} {...item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
