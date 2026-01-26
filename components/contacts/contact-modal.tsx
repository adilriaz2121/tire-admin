"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Divider,
} from "@nextui-org/react";
import {
  Contact,
  markContactAsRead,
  deleteContact,
} from "@/actions/contact.action";

interface ContactModalProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  contact,
  isOpen,
  onClose,
  onRefresh,
}) => {
  const [loading, setLoading] = useState(false);

  const handleMarkAsRead = async () => {
    if (contact.isRead) return;

    setLoading(true);
    try {
      await markContactAsRead(contact.id);
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Failed to mark contact as read:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this contact?"))
      return;

    setLoading(true);
    try {
      await deleteContact(contact.id);
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Failed to delete contact:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3>Contact Details</h3>
                <Chip
                  className="capitalize"
                  color={contact.isRead ? "success" : "warning"}
                  size="sm"
                  variant="flat"
                >
                  {contact.isRead ? "Read" : "Unread"}
                </Chip>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Name
                    </label>
                    <p className="text-base">{contact.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Email
                    </label>
                    <p className="text-base">{contact.email}</p>
                  </div>
                </div>

                {contact.phone && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Phone
                    </label>
                    <p className="text-base">{contact.phone}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Subject
                  </label>
                  <p className="text-base">{contact.subject}</p>
                </div>

                <Divider />

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Message
                  </label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-base whitespace-pre-wrap">
                      {contact.message}
                    </p>
                  </div>
                </div>

                <Divider />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <label className="font-semibold">Submitted</label>
                    <p>{new Date(contact.createdAt).toLocaleString()}</p>
                  </div>
                  {contact.updatedAt !== contact.createdAt && (
                    <div>
                      <label className="font-semibold">Last Updated</label>
                      <p>{new Date(contact.updatedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              {!contact.isRead && (
                <Button
                  color="success"
                  onPress={handleMarkAsRead}
                  isLoading={loading}
                >
                  Mark as Read
                </Button>
              )}
              <Button color="danger" onPress={handleDelete} isLoading={loading}>
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
