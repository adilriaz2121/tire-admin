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
  const handleMarkAsRead = async () => {
    try {
      await markContactAsRead(contact.id);
      onRefresh();
    } catch (error) {
      console.error("Failed to mark contact as read:", error);
    }
  };

  const handleDelete = async () => {
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
          color={contact.isRead ? "success" : "warning"}
          size="sm"
          variant="flat"
        >
          {contact.isRead ? "Read" : "Unread"}
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
          <Button
            size="sm"
            variant="light"
            onPress={() => onView(contact)}
            className="text-blue-600 hover:text-blue-800"
            startContent={
              <EyeIcon 
                fill="currentColor" 
                size={16} 
                width={16} 
                height={16}
                className="w-4 h-4"
              />
            }
          >
            View
          </Button>

          {!contact.isRead && (
            <Button
              size="sm"
              variant="light"
              color="success"
              onPress={handleMarkAsRead}
              className="text-green-600 hover:text-green-800"
              startContent={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              }
            >
              Mark Read
            </Button>
          )}

          <Button
            size="sm"
            variant="light"
            color="danger"
            onPress={handleDelete}
            className="text-red-600 hover:text-red-800"
            startContent={
              <DeleteIcon 
                fill="currentColor" 
                size={16} 
                width={16} 
                height={16}
                className="w-4 h-4"
              />
            }
          >
            Delete
          </Button>
        </div>
      );

    default:
      return <span>{cellValue?.toString()}</span>;
  }
};
