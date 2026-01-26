"use client";
import React from "react";
import { ChevronDownIcon } from "../icons/sidebar/chevron-down-icon";
import { Accordion, AccordionItem } from "@nextui-org/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FileCheck2 } from "lucide-react";
interface Props {
  icon: React.ReactNode;
  title: string;
  items: { name: string; _id: string }[];
}

export const CollapseItems = ({ icon, items, title }: Props) => {
  const currentPath = usePathname();
  const searchParams = useSearchParams();
  const currentTable = searchParams.get("currentTable");
  return (
    <div className="flex flex-col gap-4 w-full cursor-pointer">
      <Accordion className="px-0" defaultExpandedKeys={["accordion-1"]}>
        <AccordionItem
          key="accordion-1"
          indicator={<ChevronDownIcon />}
          classNames={{
            indicator: "data-[open=true]:-rotate-180",
            trigger:
              "py-0 min-h-[44px] hover:bg-default-100 rounded-xl active:scale-[0.98] transition-transform px-3.5",
            title:
              "px-0 flex text-base gap-2 h-full items-center cursor-pointer",
          }}
          aria-label="Accordion 1"
          title={
            <div className="flex flex-row gap-2">
              <span>{icon}</span>
              <span>{title}</span>
            </div>
          }
        >
          <div className="pl-5">
            {items.map((item, index) => {
              const isActive =
                currentPath.startsWith("/dashboard/products") &&
                currentTable === item._id;
              return (
                <Link
                  key={index}
                  href={`/dashboard/products?currentTable=${item._id}`}
                  className={`w-full flex text-default-500 my-0.5  p-2 items-end gap-2 rounded-xl transition-colors capitalize ${isActive
                      ? "bg-[#05CB14] text-white"
                      : "hover:bg-slate-100 dark:hover:bg-slate-600 hover:text-default-900"
                    }`}
                >
                  <FileCheck2 className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
