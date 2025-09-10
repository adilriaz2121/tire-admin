import { Input, Link, Navbar, NavbarContent } from "@nextui-org/react";
import React from "react";
import { BurguerButton } from "./burguer-button";
import { UserDropdown } from "./user-dropdown";
import { useCheckAdmin } from "../hooks/useCheckingAdmin";
import Image from "next/image";

interface Props {
  children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
  const { isAdmin } = useCheckAdmin();
  return (
    <div className="relative flex flex-col flex-1 overflow-hidden">
      <Navbar
        isBordered
        className="w-full fixed top-0 px-1 z-[25] md:px-5"
        classNames={{
          wrapper: "w-full max-w-full",
        }}
      >
        <Link href={"/dashboard"}>
          <Image
            src={"/logo copy.png"}
            alt="Bay DJ"
            height={40}
            width={80}
            className="h-auto w-32"
          />
        </Link>

        <div className="flex items-center gap-x-4">
          <UserDropdown />
          <NavbarContent className="md:hidden">
            <BurguerButton />
          </NavbarContent>
        </div>
      </Navbar>
      <div className="mt-20 px-5">{children}</div>
    </div>
  );
};
