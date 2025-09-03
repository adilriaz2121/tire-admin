"use client";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { TableWrapper } from "@/components/table/table";
import { IMeta, IUser } from "@/helpers/types";
import { RenderCell } from "./render-cell";
import UserModal from "./user-modal";
import { createUser } from "@/actions/user.action";
import { toast } from "sonner";
import SearchInput from "../search-input";
import useUpdateSearchParams from "../hooks/useUpdateSearchParams";

export const Accounts = ({ data, meta }: { data: IUser[]; meta: IMeta }) => {
  const { updateSearchParams } = useUpdateSearchParams();
  const columns = [
    { name: "Email", uid: "email" },
    { name: "FULL NAME", uid: "full_name" },
    { name: "CREATED AT", uid: "createdAt" },
    { name: "TYPE", uid: "type" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const handleAddUser = async (_: string, data: IUser) => {
    toast.promise(
      createUser(data).then((result) => {
        if (result.error) {
          throw new Error(result.error);
        }
        return result;
      }),
      {
        loading: "Creating Admin...",
        success: "Admin created successfully!",
        error: "Error creating Admin.",
      }
    );
  };
  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">


      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <h3 className="text-xl font-semibold">All Admins</h3>

        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <UserModal mode="Add" onConfirm={handleAddUser} />
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper
          meta={meta}
          RenderCell={RenderCell}
          data={data}
          columns={columns}
        />
      </div>
    </div>
  );
};
