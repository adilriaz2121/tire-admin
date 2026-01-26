"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Select,
  SelectItem,
  Button,
  Chip,
} from "@nextui-org/react";
import {
  Contact,
  getAllContacts,
  markAllContactsAsRead,
  deleteMultipleContacts,
} from "@/actions/contact.action";
import { RenderCell } from "./render-cell";
import { ContactModal } from "./contact-modal";
import SearchInput from "../search-input";
import useUpdateSearchParams from "@/components/hooks/useTableSearchParams";

interface ContactsProps {
  initialData?: Contact[];
  initialMeta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const ContactsPage: React.FC<ContactsProps> = ({
  initialData = [],
  initialMeta,
}) => {
  const [contacts, setContacts] = useState<Contact[]>(initialData);
  const [meta, setMeta] = useState(
    initialMeta || { page: 1, limit: 10, total: 0, totalPages: 1 }
  );
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const { searchParams, updateSearchParams } = useUpdateSearchParams();

  const columns = [
    { name: "NAME", uid: "name" },
    { name: "EMAIL", uid: "email" },
    { name: "SUBJECT", uid: "subject" },
    { name: "STATUS", uid: "isRead" },
    { name: "DATE", uid: "createdAt" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: parseInt(searchParams.get("page") || "1"),
        limit: parseInt(searchParams.get("limit") || "10"),
        search: searchParams.get("search") || undefined,
        isRead: searchParams.get("isRead") || undefined,
        dateFrom: searchParams.get("dateFrom") || undefined,
        dateTo: searchParams.get("dateTo") || undefined,
      };

      const response = await getAllContacts(params);
      setContacts(response.data.contacts);
      setMeta({
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
      });
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleView = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllContactsAsRead();
      fetchContacts(); // Refresh the data
    } catch (error) {
      console.error("Failed to mark all contacts as read:", error);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedKeys.size === 0) return;

    try {
      const contactIds = Array.from(selectedKeys);
      await deleteMultipleContacts(contactIds);
      setSelectedKeys(new Set());
      fetchContacts(); // Refresh the data
    } catch (error) {
      console.error("Failed to delete contacts:", error);
    }
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: page.toString() });
  };

  const handleLimitChange = (limit: string) => {
    updateSearchParams({ limit, page: "1" });
  };

  const handleSearch = (search: string) => {
    updateSearchParams({ search: search || undefined, page: "1" });
  };

  const handleStatusFilter = (status: string) => {
    updateSearchParams({ isRead: status || undefined, page: "1" });
  };

  const unreadCount = contacts.filter(
    (contact) => !contact.isRead
  ).length;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SearchInput name="contacts" callback={handleSearch} />
          <Select
            placeholder="Filter by status"
            className="w-full"
            selectedKeys={
              searchParams.get("isRead") ? [searchParams.get("isRead")!] : []
            }
            onSelectionChange={(keys) => {
              const status = Array.from(keys)[0] as string;
              handleStatusFilter(status || "");
            }}
          >
            <SelectItem key="" value="">
              All
            </SelectItem>
            <SelectItem key="false" value="false">
              Unread
            </SelectItem>
            <SelectItem key="true" value="true">
              Read
            </SelectItem>
          </Select>
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <Button
              color="primary"
              variant="flat"
              onPress={handleMarkAllAsRead}
            >
              Mark All as Read ({unreadCount})
            </Button>
          )}
          {selectedKeys.size > 0 && (
            <Button
              color="danger"
              variant="flat"
              onPress={handleDeleteSelected}
            >
              Delete Selected ({selectedKeys.size})
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">
          Total {meta.total} contacts
        </span>
        <div className="flex items-center gap-2">
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
          </label>
          <Select
            className="w-20"
            size="sm"
            selectedKeys={[searchParams.get("limit") || "10"]}
            onSelectionChange={(keys) => {
              const limit = Array.from(keys)[0] as string;
              handleLimitChange(limit);
            }}
          >
            <SelectItem key="10" value="10">
              10
            </SelectItem>
            <SelectItem key="25" value="25">
              25
            </SelectItem>
            <SelectItem key="50" value="50">
              50
            </SelectItem>
          </Select>
        </div>
      </div>

      <Table
        aria-label="Contacts table"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => {
          if (keys === "all") {
            setSelectedKeys(new Set(contacts.map(contact => contact.id)));
          } else {
            setSelectedKeys(new Set(Array.from(keys as Set<string>)));
          }
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={contacts}
          isLoading={loading}
          emptyContent="No contacts found"
        >
          {(contact) => (
            <TableRow key={contact.id}>
              {(columnKey) => (
                <TableCell>
                  <RenderCell
                    contact={contact}
                    columnKey={columnKey as string}
                    onView={handleView}
                    onRefresh={fetchContacts}
                  />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={loading}
          page={meta.page}
          total={meta.totalPages}
          variant="light"
          onChange={handlePageChange}
        />
        <div className="flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={loading}
            size="sm"
            variant="flat"
            onPress={fetchContacts}
          >
            Refresh
          </Button>
        </div>
      </div>

      {selectedContact && (
        <ContactModal
          contact={selectedContact}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedContact(null);
          }}
          onRefresh={fetchContacts}
        />
      )}
    </div>
  );
};

export default ContactsPage;
