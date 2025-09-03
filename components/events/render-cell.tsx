import { Tooltip, Chip } from "@nextui-org/react";
import React from "react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { EditIcon } from "../icons/table/edit-icon";
import { EyeIcon } from "../icons/table/eye-icon";
import { IUser } from "@/helpers/types";
import Link from "next/link";
import EventModal from "./event-modal";
import { deleteUser, editUser } from "@/actions/user.action";
import { toast } from "sonner";
import { deleteEvent, editEvent, updateEvent } from "@/actions/event.action";
import { CalendarCog } from "lucide-react";
import EditModel from "./edit-modal";

interface Props {
  item: any;
  columnKey: string | React.Key;
}
type PayloadType = {
  isApproved?: boolean;
  isRejected?: boolean;
};

export const RenderCell = ({ item, columnKey }: Props) => {
  const cellValue = item[columnKey as keyof IUser];


  const handleEditEvent = async (_: string, data: any) => {
    const payload = {
      isApproved: false,
      isRejected: false,
    };
    if (data === "Approved") {
      payload.isApproved = true;
    } else if (data === "Rejected") {
      payload.isRejected = true;
    }

    console.log("🚀 ~ handleEditEvent ~ payload:", payload)
    toast.promise(
      editEvent(item._id, payload).then((result) => {
        if (result.error) {
          throw new Error(result.error);
        }
        return result;
      }),
      {
        loading: "Updatig Event Status...",
        success: "Event status updated successfully!",
        error: "Error updating status.",
      }
    );
  };

  const handleDeleteEvent = async () => {
    toast.promise(
      deleteEvent(item._id).then((result) => {
        if (result.error) {
          throw new Error(result.error);
        }
        return result;
      }),
      {
        loading: "Deleting event...",
        success: "Event deleted successfully!",
        error: "Error deleting event.",
      }
    );
  }; switch (columnKey) {
    case "email":
      return <div className="">{cellValue}</div>;

    case "full_name":
      return <div className="">{cellValue}</div>;
    case "event_date":
      return <div className="">  {new Date(cellValue).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })}</div>;

    case "area":
      return (
        <Chip
          size="sm"
          variant="flat"
          color={
            cellValue === "east_bay"
              ? "success"
              : cellValue === "south_bay"
                ? "primary"
                : "danger"
          }
        >
          <span className="capitalize text-xs">
            {cellValue.split("_").join(" ")}
          </span>
        </Chip>

      );


    case "status":
      if (item.isRejected) {
        return <span className="text-red-500 texts">Rejected</span>;
      } else if (item.isApproved) {
        return <span className="text-green-500 text-sm">Approved</span>;
      } else {
        return <span className="text-yellow-500 text-sm">Not Approved</span>;
      }
    case "actions":
      return (
        <div className="flex items-center gap-4">
          <div>
            <Tooltip content="Details">
              <EventModal
                button={<EyeIcon size={20} fill="#979797" />}
                mode="View"
                data={item}
              />
            </Tooltip>
          </div>
          <div>
            <Tooltip content="Edit user" color="secondary">
              <EventModal
                button={<EditIcon size={20} fill="#1a740e" />}
                mode="Edit"
                data={item}
                onConfirm={handleEditEvent}
              />
            </Tooltip>
          </div>
          <div>
            <Tooltip content="Delete user" color="danger">
              <EventModal
                button={<DeleteIcon size={20} fill="#FF0080" />}
                mode="Delete"
                data={item}
                onConfirm={handleDeleteEvent}
              />
            </Tooltip>
          </div>
          <div>
            <Tooltip content="Update Event" color="danger">
              <EditModel

                data={item}
              />
            </Tooltip>
          </div>
        </div>
      );

    default:
      return <div>{cellValue}</div>;
  }
};
