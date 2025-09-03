import React from "react";
import { useTheme as useNextTheme, useTheme } from "next-themes";
import { Button, Switch } from "@nextui-org/react";
import { MoonIcon, SunIcon } from "lucide-react";

export const DarkModeSwitch = () => {
  const { setTheme, theme } = useTheme();
  return (
    // <Switch
    //   isSelected={resolvedTheme === "dark" ? true : false}
    //   onValueChange={(e) => setTheme(e ? "dark" : "light")}
    // />
    <button
      className="rounded-full w-8 h-8 bg-background flex items-center justify-center border border-s"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <SunIcon className="w-[1.2rem] h-[1.2rem] rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100" />
      <MoonIcon className="absolute w-[1.2rem] h-[1.2rem] rotate-0 scale-1000 transition-transform ease-in-out duration-500 dark:-rotate-90 dark:scale-0" />
      <span className="sr-only">Switch Theme</span>
    </button>
  );
};
