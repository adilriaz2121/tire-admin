"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TableWrapper } from "@/components/table/table";
import { IMeta } from "@/helpers/types";
import { RenderCell } from "./render-cell";
import { Select, SelectItem } from "@nextui-org/react";
import useUpdateSearchParams from "@/hooks/use-update-params";
import SearchInput from "../search-input";

export const Events = ({ data, meta }: { data: any; meta: any }) => {
    console.log("🚀 ~ Events ~ meta:", meta)
    const router = useRouter();
    const { updateSearchParams } = useUpdateSearchParams();
    const [currentEvents, setCurrentEvents] = useState("All Events")
    const columns = [
        { name: "Event Name", uid: "name" },
        { name: "Genre", uid: "genre" },
        { name: "Venue", uid: "venue" },
        { name: "Area", uid: "area" },
        { name: "Date", uid: "event_date" },
        { name: "Status", uid: "status" },
        { name: "ACTIONS", uid: "actions" },

    ];

    const handleStatusChange = (value: any) => {
        const params = new URLSearchParams();
        if (value === "approved") {
            params.set("isApproved", "true");
            setCurrentEvents("Approved Events")
        }
        else if (value === "not_approved") {
            params.set("isApproved", "false");
            setCurrentEvents("Not Approved Events")

        }
        else if (value === "rejected") {
            params.set("isRejected", "true");
            setCurrentEvents("Rejected Events")


        }
        else {
            params.delete("isApproved");
            params.delete("isRejected");
            setCurrentEvents("All Events")
        }
        router.push(`/dashboard/events?${params.toString()}`);
    };

    return (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
            <div className="flex justify-between flex-wrap gap-4 items-center">
                <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                    <h3 className="text-xl font-semibold">{currentEvents} ({meta.total})</h3>
                </div>
                <div className="flex items-center gap-x-2">

                    <SearchInput name="Events" debounceTime={500} />
                    <Select
                        aria-label="Filter by Status"
                        placeholder="Filter by Status"
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="w-40"
                    >
                        <SelectItem key="all" value="all">All</SelectItem>
                        <SelectItem key="not_approved" value="not_approved">Not Approved</SelectItem>
                        <SelectItem key="approved" value="approved">Approved</SelectItem>
                        <SelectItem key="rejected" value="rejected">Rejected</SelectItem>
                    </Select>
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
