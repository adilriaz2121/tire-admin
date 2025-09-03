import React from "react";
import { Sidebar } from "./sidebar.styles";
import { SidebarItem } from "./sidebar-item";
import { useSidebarContext } from "../layout/layout-context";
import { usePathname } from "next/navigation";
import { routes } from "@/config/routes";
export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();
  return (
    <aside className="h-screen sticky top-0 z-50 lg:z-10">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        {/* <div className={Sidebar.Header()}>
          <CompanyCard />
        </div> */}
        <div className="flex flex-col justify-between h-full min-w-56 lg:mt-9 ">
          <div className={Sidebar.Body()}>
            {routes.map((route) => (
              <SidebarItem
                key={route.href}
                title={route.title}
                icon={<route.icon />}
                isActive={pathname === route.href}
                href={route.href}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
