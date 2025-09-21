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
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Order, updateOrderStatus } from "@/actions/order.action";

interface OrderModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  order,
  isOpen,
  onClose,
  onRefresh,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status);

  const statusOptions = [
    { key: "pending", label: "Pending", color: "warning" },
    { key: "shipped", label: "Shipped", color: "primary" },
    { key: "delivered", label: "Delivered", color: "success" },
    { key: "cancelled", label: "Cancelled", color: "danger" },
  ];

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status) return;

    setLoading(true);
    try {
      await updateOrderStatus(order.id, selectedStatus as any);
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusColorMap: Record<
    string,
    "success" | "warning" | "primary" | "danger"
  > = {
    delivered: "success",
    shipped: "primary",
    pending: "warning",
    cancelled: "danger",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3>Order Details</h3>
                <Chip
                  className="capitalize"
                  color={statusColorMap[order.status]}
                  size="sm"
                  variant="flat"
                >
                  {order.status}
                </Chip>
              </div>
              <p className="text-sm font-mono text-gray-500">ID: {order.id}</p>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-6">
                {/* Customer Information */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Name
                      </label>
                      <p className="text-base">{order.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Email
                      </label>
                      <p className="text-base">{order.email}</p>
                    </div>
                    {order.phone && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Phone
                        </label>
                        <p className="text-base">{order.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                <Divider />

                {/* Shipping Information */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">
                    Shipping Address
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-gray-600">
                        Address
                      </label>
                      <p className="text-base">{order.address}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        City
                      </label>
                      <p className="text-base">{order.city}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        State
                      </label>
                      <p className="text-base">{order.state}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        ZIP Code
                      </label>
                      <p className="text-base">{order.zip}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Country
                      </label>
                      <p className="text-base">{order.country}</p>
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Order Information */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">
                    Order Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Total Amount
                      </label>
                      <p className="text-xl font-bold text-green-600">
                        ${(order.totalAmount || order.total || 0).toFixed(2)}{" "}
                        {order.currency || "USD"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Payment Intent ID
                      </label>
                      <p className="text-base font-mono">
                        {order.paymentIntentId}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Order Date
                      </label>
                      <p className="text-base">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {order.updatedAt !== order.createdAt && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Last Updated
                        </label>
                        <p className="text-base">
                          {new Date(order.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Information */}
                {(order.productInfo || order.productIds) && (
                  <>
                    <Divider />
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Products</h4>
                      {order.productInfo ? (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="text-sm whitespace-pre-wrap">
                            {JSON.stringify(order.productInfo, null, 2)}
                          </pre>
                        </div>
                      ) : (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">
                            Product IDs
                          </label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {order.productIds.map((id, index) => (
                              <Chip key={index} size="sm" variant="flat">
                                {id}
                              </Chip>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Additional Information */}
                {(order.userInfo ||
                  order.shippingInfo ||
                  order.pricingInfo) && (
                  <>
                    <Divider />
                    <div>
                      <h4 className="text-lg font-semibold mb-3">
                        Additional Information
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        {order.userInfo && (
                          <div>
                            <label className="text-sm font-semibold text-gray-600">
                              User Info
                            </label>
                            <div className="bg-gray-50 p-3 rounded-lg mt-1">
                              <pre className="text-sm whitespace-pre-wrap">
                                {JSON.stringify(order.userInfo, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                        {order.shippingInfo && (
                          <div>
                            <label className="text-sm font-semibold text-gray-600">
                              Shipping Info
                            </label>
                            <div className="bg-gray-50 p-3 rounded-lg mt-1">
                              <pre className="text-sm whitespace-pre-wrap">
                                {JSON.stringify(order.shippingInfo, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                        {order.pricingInfo && (
                          <div>
                            <label className="text-sm font-semibold text-gray-600">
                              Pricing Info
                            </label>
                            <div className="bg-gray-50 p-3 rounded-lg mt-1">
                              <pre className="text-sm whitespace-pre-wrap">
                                {JSON.stringify(order.pricingInfo, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <Divider />

                {/* Status Update */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">Update Status</h4>
                  <Select
                    label="Order Status"
                    placeholder="Select status"
                    selectedKeys={[selectedStatus]}
                    onSelectionChange={(keys) => {
                      const status = Array.from(keys)[0] as string;
                      setSelectedStatus(status);
                    }}
                  >
                    {statusOptions.map((status) => (
                      <SelectItem key={status.key} value={status.key}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              {selectedStatus !== order.status && (
                <Button
                  color="primary"
                  onPress={handleStatusUpdate}
                  isLoading={loading}
                >
                  Update Status
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
