import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "@components/LanguageSwitcher";
import MainSidebar from "@components/MainSidebar";
import UserInfo from "@components/UserInfo";
import { Button } from "@components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@components/ui/sidebar";

import { useAuthContext } from "@contexts/AuthContext";

import { AppRoutes } from "@lib/types";

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  const location = useLocation();
  const { isAuthenticated, onLogOut } = useAuthContext();
  const { t } = useTranslation("common");

  if (!isAuthenticated || location.pathname === AppRoutes.LOGIN) {
    return children;
  }

  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <header className="flex pl-2 pt-3 justify-between h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <SidebarTrigger />
          <div className="flex items-center">
            <LanguageSwitcher />
            <UserInfo />
            <Button variant="link" className="text-sm!" onClick={onLogOut}>
              {t("logout")}
            </Button>
          </div>
        </header>
        <main className="p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
