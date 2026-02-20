"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
  Chip,
} from "@nextui-org/react";
import { Order, shipOrder, getInstallerDetails } from "@/actions/order.action";
import { toast } from "sonner";
import { MapPin, Truck, User, Wrench } from "lucide-react";

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

const shippingTypeLabels: Record<string, { label: string; color: string; description: string }> = {
  ShipToMe: { label: "Ship to Me", color: "bg-green-100 text-green-800", description: "Shipping directly to customer address" },
  MobileInstaller: { label: "Mobile Installer", color: "bg-purple-100 text-purple-800", description: "Shipping to customer — installer will come to them" },
  LocalInstaller: { label: "Local Installer", color: "bg-blue-100 text-blue-800", description: "Shipping to installer shop" },
  FedExPickup: { label: "FedEx Pickup", color: "bg-orange-100 text-orange-800", description: "Customer will pick up from FedEx location" },
};

export const ShipOrderModal: React.FC<ShipOrderModalProps> = ({
  order,
  isOpen,
  onClose,
  onRefresh,
}) => {
  const [loading, setLoading] = useState(false);
  const [installerInfo, setInstallerInfo] = useState<any>(null);
  const [installerLoading, setInstallerLoading] = useState(false);

  // Fetch installer details for LocalInstaller shipping
  useEffect(() => {
    if (order.installerId && order.shippingLocation === 'LocalInstaller') {
      setInstallerLoading(true);
      getInstallerDetails(order.installerId)
        .then((res) => {
          if (res.success && res.data) {
            setInstallerInfo(res.data);
          }
        })
        .catch(() => {})
        .finally(() => setInstallerLoading(false));
    } else {
      setInstallerInfo(null);
    }
  }, [order.installerId, order.shippingLocation]);

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

  const shippingType = shippingTypeLabels[order.shippingLocation] || shippingTypeLabels.ShipToMe;

  // Determine the "Ship To" address based on shipping type
  const getShipToSection = () => {
    if (order.shippingLocation === 'LocalInstaller' && (installerInfo || order.installerName)) {
      // Ship to installer shop
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-4 h-4 text-blue-600" />
            <h4 className="font-semibold text-blue-900">
              Ship To (Installer Shop)
            </h4>
          </div>
          <div className="ml-6 space-y-1">
            {installerLoading ? (
              <p className="text-gray-500">Loading installer details...</p>
            ) : installerInfo ? (
              <>
                <p className="font-medium text-gray-900">{installerInfo.name}</p>
                {installerInfo.location && (
                  <>
                    {installerInfo.location.address1 && (
                      <p className="text-gray-700">{installerInfo.location.address1}</p>
                    )}
                    <p className="text-gray-700">
                      {installerInfo.location.city}, {installerInfo.location.state} {installerInfo.location.zip_code}
                    </p>
                    <p className="text-gray-700">{installerInfo.location.country}</p>
                  </>
                )}
                {installerInfo.display_phone && (
                  <p className="text-gray-500 text-sm">Phone: {installerInfo.display_phone}</p>
                )}
              </>
            ) : (
              <>
                <p className="font-medium text-gray-900">{order.installerName || 'Unknown Installer'}</p>
                <p className="text-gray-500 text-sm">Installer address not available — will ship to customer address</p>
              </>
            )}
          </div>
        </div>
      );
    }

    // ShipToMe, MobileInstaller, FedExPickup — all ship to customer address
    const labelMap: Record<string, string> = {
      ShipToMe: "Ship To (Customer)",
      MobileInstaller: "Ship To (Customer — Installer will visit)",
      FedExPickup: "Ship To (Customer / FedEx Pickup)",
    };

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-blue-600" />
          <h4 className="font-semibold text-blue-900">
            {labelMap[order.shippingLocation] || "Ship To (Customer)"}
          </h4>
        </div>
        <div className="ml-6 space-y-1">
          <p className="font-medium text-gray-900">{order.userName}</p>
          <p className="text-gray-700">{order.address}</p>
          <p className="text-gray-700">
            {order.city}, {order.state} {order.zip}
          </p>
          <p className="text-gray-700">{order.country}</p>
          {order.phone && (
            <p className="text-gray-500 text-sm">Phone: {order.phone}</p>
          )}
          <p className="text-gray-500 text-sm">Email: {order.email}</p>
        </div>
      </div>
    );
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
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm font-mono text-gray-500">
                  Order ID: {order.id}
                </p>
                <Chip size="sm" className={shippingType.color}>
                  {shippingType.label}
                </Chip>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-5">
                {/* Shipping type info */}
                <p className="text-sm text-gray-600">{shippingType.description}</p>

                {/* Ship To address (dynamic based on shipping type) */}
                {getShipToSection()}

                {/* Installer info for MobileInstaller */}
                {order.shippingLocation === 'MobileInstaller' && order.installerName && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-semibold text-purple-900">Installer:</span>
                      <span className="text-sm text-purple-800">{order.installerName}</span>
                    </div>
                    {order.appointmentDate && (
                      <p className="text-sm text-purple-700 ml-6 mt-1">
                        Appointment: {new Date(order.appointmentDate).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Appointment info for LocalInstaller */}
                {order.shippingLocation === 'LocalInstaller' && order.appointmentDate && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <p className="text-sm text-blue-700">
                      <span className="font-semibold">Appointment:</span> {new Date(order.appointmentDate).toLocaleString()}
                    </p>
                  </div>
                )}

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
                isDisabled={loading || installerLoading}
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
