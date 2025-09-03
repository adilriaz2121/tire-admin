import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

type EventModalProps = {
  mode?: string;
  data?: any;
  button?: React.ReactNode;
  onConfirm?: (mode: string, data: any) => Promise<void>;
};


const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center border-b pb-2">
    <span className="font-medium text-gray-900">{label}</span>
    <span className="text-neutral-600">{value}</span>
  </div>
);

const LinkItem = ({ label, href }: { label: string; href: string }) => (
  <div className="flex justify-between items-center border-b pb-2">
    <span className="font-medium text-gray-900">{label}</span>
    <a href={href} target="_blank" className="text-blue-500 underline">
      {label} Link
    </a>
  </div>
);
const EventModal = ({
  mode = "View",
  data,
  onConfirm,
  button,
}: EventModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const [editedEvent, setEditedEvent] = useState({
    name: "",
    event_date: "",
    status: "",
    ...data,
  });
  console.log("🚀 ~ editedEvent:", editedEvent)
  console.log("🚀 ~ editedEvent:", data)
  const [status, setStatus] = useState("Not Approved")
  const title = `${mode} Event`;
  const isViewMode = mode === "View";
  const isDeleteMode = mode === "Delete";
  const isUpdateMode = mode === "update";
  const buttonText = isDeleteMode ? "Confirm Delete" : "Update Status";

  useEffect(() => {
    if (data) {
      setEditedEvent({
        ...data,
        status: data.isRejected
          ? "Rejected"
          : data.isApproved
            ? "Approved"
            : "Not Approved",
      });
      setStatus(
        data.isRejected
          ? "Rejected"
          : data.isApproved
            ? "Approved"
            : "Not Approved"
      );
    }
  }, [data]);


  const handleStatusChange = (value: string) => {
    console.log("🚀 ~ handleStatusChange ~ value:", value)
    setStatus(value)
  };

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm(mode, status);
      router.refresh();
    }
    onClose();
  };
  const formattedDate = new Date(data && data.event_date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formatTime = (time: any) => {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hour), parseInt(minute));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };
  return (
    <div>
      {button ? (
        <button onClick={onOpen}>{button}</button>
      ) : (
        <Button onPress={onOpen} className="bg-[#FF3E55] text-white">
          {mode} Event
        </Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose} placement="top-center" className="max-h-[90vh] overflow-y-auto z-[100000]">
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>
            {isDeleteMode ? (
              <p>
                Are you sure you want to delete event{" "}
                <span className="underline">{editedEvent.name}</span>
              </p>
            ) : isViewMode ? (
              <>
                <div className="flex items-center flex-col  gap-4">
                  {/* Event Banner */}
                  {data.event_banner && (
                    <img
                      src={data.event_banner}
                      alt="Event Banner"
                      className="object-contain max-w-full h-40 rounded"
                    />
                  )}
                  <div className="flex flex-col w-full">

                    <DetailItem label="Event Name" value={data.name} />
                    <DetailItem label="Genre" value={data.genre} />
                    <DetailItem label="Region" value={data.area.split("_").join(" ")} />
                    <DetailItem label="Venue" value={data.venue} />
                    <DetailItem label="Event Date" value={formattedDate} />
                    <DetailItem label="Start Time" value={formatTime(data.event_start)} />
                    <DetailItem label="End Time" value={formatTime(data.event_end)} />
                    <DetailItem label="Event Type" value={data.event_type} />
                    <DetailItem label="DJs" value={data.djs.join(", ")} />

                    {/* Links */}
                    {data.website_link && (
                      <LinkItem label="Website" href={data.website_link} />
                    )}
                    {data.ticket_link && (
                      <LinkItem label="Ticket" href={data.ticket_link} />
                    )}
                  </div>

                </div>
              </>
            ) :

            
              (
                <>



                  <Select
                    label="Status"
                    selectedKeys={[status]}
                    onChange={(e: any) => handleStatusChange(e.target.value)}
                    variant="bordered"
                  >
                    <SelectItem key="Not Approved">Not Approved</SelectItem>
                    <SelectItem key="Approved">Approved</SelectItem>
                    <SelectItem key="Rejected">Rejected</SelectItem>
                  </Select>
                </>
              )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Close
            </Button>
            {!isViewMode && (
              <Button color="primary" onPress={handleConfirm}>
                {buttonText}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div >
  );
};

export default EventModal;
