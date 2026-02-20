"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
} from "@nextui-org/react";
import { Order, shipOrder } from "@/actions/order.action";
import { toast } from "sonner";
import { MapPin, Truck } from "lucide-react";

interface ShipOrderModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const WAREHOUSE_ADDRESS = {
  name: "The Tire Deal Warehouse",
  street: "301 S Millers Ferry Rd",
  city: "Wilmer",
  state: "TX",
  zip: "75172",
  country: "US",
};

export const ShipOrderModal: React.FC<ShipOrderModalProps> = ({
  order,
  isOpen,
  onClose,
  onRefresh,
}) => {
  const [loading, setLoading] = useState(false);

  const handleShip = async () => {
    setLoading(true);
    try {
      const result = await shipOrder(order.id);
      if (result.success) {
        toast.success(
          `Order shipped! Tracking #: ${result.data.trackingNumber}`,
          { duration: 6000 }
        );
        onRefresh();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create FedEx shipment");
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
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                <h3>Ship Order via FedEx</h3>
              </div>
              <p className="text-sm font-mono text-gray-500">
                Order ID: {order.id}
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-5">
                {/* Customer Shipping Address */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">
                      Ship To (Customer)
                    </h4>
                  </div>
                  <div className="ml-6 space-y-1">
                    <p className="font-medium text-gray-900">
                      {order.userName}
                    </p>
                    <p className="text-gray-700">{order.address}</p>
                    <p className="text-gray-700">
                      {order.city}, {order.state} {order.zip}
                    </p>
                    <p className="text-gray-700">{order.country}</p>
                    {order.phone && (
                      <p className="text-gray-500 text-sm">
                        Phone: {order.phone}
                      </p>
                    )}
                    <p className="text-gray-500 text-sm">
                      Email: {order.email}
                    </p>
                  </div>
                </div>

                <Divider />

                {/* Warehouse Address */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <h4 className="font-semibold text-gray-900">
                      Ship From (Warehouse)
                    </h4>
                  </div>
                  <div className="ml-6 space-y-1">
                    <p className="font-medium text-gray-900">
                      {WAREHOUSE_ADDRESS.name}
                    </p>
                    <p className="text-gray-700">
                      {WAREHOUSE_ADDRESS.street}
                    </p>
                    <p className="text-gray-700">
                      {WAREHOUSE_ADDRESS.city}, {WAREHOUSE_ADDRESS.state}{" "}
                      {WAREHOUSE_ADDRESS.zip}
                    </p>
                    <p className="text-gray-700">{WAREHOUSE_ADDRESS.country}</p>
                  </div>
                </div>

              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                onPress={onClose}
                isDisabled={loading}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                className="bg-black text-white"
                onPress={handleShip}
                isLoading={loading}
                isDisabled={loading}
                startContent={!loading && <Truck className="w-4 h-4" />}
              >
                Create FedEx Shipment
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
