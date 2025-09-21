"use client";

import React from "react";
import { Chip, Tooltip, Button } from "@nextui-org/react";
import {
  Contact,
  markContactAsRead,
  deleteContact,
} from "@/actions/contact.action";
import { EyeIcon } from "../icons/table/eye-icon";
import { DeleteIcon } from "../icons/table/delete-icon";

interface RenderCellProps {
  contact: Contact;
  columnKey: string;
  onView: (contact: Contact) => void;
  onRefresh: () => void;
}

export const RenderCell: React.FC<RenderCellProps> = ({
  contact,
  columnKey,
  onView,
  onRefresh,
}) => {
  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markContactAsRead(contact.id);
      onRefresh();
    } catch (error) {
      console.error("Failed to mark contact as read:", error);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await deleteContact(contact.id);
        onRefresh();
      } catch (error) {
        console.error("Failed to delete contact:", error);
      }
    }
  };

  const cellValue = contact[columnKey as keyof Contact];

  switch (columnKey) {
    case "name":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">{contact.name}</p>
          {contact.phone && (
            <p className="text-bold text-tiny capitalize text-default-400">
              {contact.phone}
            </p>
          )}
        </div>
      );

    case "email":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small">{contact.email}</p>
        </div>
      );

    case "subject":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small">{contact.subject}</p>
          <p className="text-bold text-tiny text-default-400 line-clamp-2">
            {contact.message.substring(0, 100)}
            {contact.message.length > 100 ? "..." : ""}
          </p>
        </div>
      );

    case "isRead":
      return (
        <Chip
          className="capitalize"
          color={contact.isRead === "true" ? "success" : "warning"}
          size="sm"
          variant="flat"
        >
          {contact.isRead === "true" ? "Read" : "Unread"}
        </Chip>
      );

    case "createdAt":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small">
            {new Date(contact.createdAt).toLocaleDateString()}
          </p>
          <p className="text-bold text-tiny capitalize text-default-400">
            {new Date(contact.createdAt).toLocaleTimeString()}
          </p>
        </div>
      );

    case "actions":
      return (
        <div className="relative flex items-center gap-2">
          <Tooltip content="View details">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onView(contact)}
            >
              <EyeIcon />
            </Button>
          </Tooltip>

          {contact.isRead === "false" && (
            <Tooltip content="Mark as read">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="success"
                onPress={handleMarkAsRead}
              >
                ✓
              </Button>
            </Tooltip>
          )}

          <Tooltip color="danger" content="Delete contact">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onPress={handleDelete}
            >
              <DeleteIcon />
            </Button>
          </Tooltip>
        </div>
      );

    default:
      return <span>{cellValue?.toString()}</span>;
  }
};
