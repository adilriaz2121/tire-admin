import React from "react";
import { useSidebarContext } from "../layout/layout-context";
import { StyledBurgerButton } from "./navbar.styles";
import { Menu } from "lucide-react";

export const BurguerButton = () => {
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <div
      // className={StyledBurgerButton()}
      className="text-white cursor-pointer"
      // open={collapsed}
      onClick={setCollapsed}
    >
      <Menu />
    </div>
  );
};
