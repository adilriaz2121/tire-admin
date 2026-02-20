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
import { Order, updateOrderStatus } from "@/actions/order.action";
import { toast } from "sonner";

interface OrderModalProps {
  order: Order;
  isOpen: boolean;
  isEditMode?: boolean;
  onClose: () => void;
  onShipOrder: (order: Order) => void;
  onRefresh: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  order,
  isOpen,
  isEditMode = false,
  onClose,
  onShipOrder,
  onRefresh,
}) => {
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (newStatus: "shipped" | "cancelled") => {
    if (newStatus === order.status) return;

    setLoading(true);
    try {
      const result = await updateOrderStatus(order.id, newStatus);
      if (result.success) {
        toast.success(
          `Order status updated to ${newStatus}. An email notification has been sent to the customer.`
        );
        onRefresh();
        onClose();
      } else {
        toast.error(result.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
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
    confirmed: "warning",
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
                {/* Product Information - Show at top */}
                {order.orderItems && order.orderItems.length > 0 && (
                  <>
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Product Information</h4>
                      <div className="space-y-3">
                        {order.orderItems.map((item, index) => (
                          <div
                            key={item.id || index}
                            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                              {/* Product Image */}
                              {item.productImage && (
                                <div className="flex items-start justify-center">
                                  <img
                                    src={item.productImage}
                                    alt={item.productName || 'Product'}
                                    className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = '/placeholder-image.png';
                                    }}
                                  />
                                </div>
                              )}
                              <div className={item.productImage ? "md:col-span-2" : "md:col-span-2"}>
                                <label className="text-sm font-semibold text-gray-600">
                                  Product Name
                                </label>
                                <p className="text-base font-medium">{item.productName || 'Product'}</p>
                                {item.productBrand && (
                                  <p className="text-sm text-gray-600">Brand: {item.productBrand}</p>
                                )}
                                {item.productSize && (
                                  <p className="text-sm text-gray-600">Size: {item.productSize}</p>
                                )}
                                {item.productModel && (
                                  <p className="text-sm text-gray-600">Model: {item.productModel}</p>
                                )}
                              </div>
                              <div>
                                <label className="text-sm font-semibold text-gray-600">
                                  Quantity
                                </label>
                                <p className="text-base">{item.productQuantity || 1}</p>
                              </div>
                              <div>
                                <label className="text-sm font-semibold text-gray-600">
                                  Price
                                </label>
                                <p className="text-base font-semibold text-green-600">
                                  ${Number(item.productPrice || 0).toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Total: ${Number(item.productTotal || 0).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Divider />
                  </>
                )}

                {/* Legacy Product Info Support */}
                {(order.productInfo || order.productIds) && (!order.orderItems || order.orderItems.length === 0) && (
                  <>
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Products</h4>
                      {order.productInfo && Array.isArray(order.productInfo) ? (
                        <div className="space-y-3">
                          {order.productInfo.map(
                            (product: any, index: number) => (
                              <div
                                key={index}
                                className="bg-gray-50 p-4 rounded-lg"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <label className="text-sm font-semibold text-gray-600">
                                      Product ID
                                    </label>
                                    <p className="text-base font-mono">
                                      {product.productId || product.id || "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-semibold text-gray-600">
                                      Quantity
                                    </label>
                                    <p className="text-base">
                                      {product.quantity || 1}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-semibold text-gray-600">
                                      Price
                                    </label>
                                    <p className="text-base font-semibold text-green-600">
                                      $
                                      {(
                                        product.price ||
                                        product.unitPrice ||
                                        0
                                      ).toFixed(2)}
                                    </p>
                                  </div>
                                  {product.name && (
                                    <div className="md:col-span-3">
                                      <label className="text-sm font-semibold text-gray-600">
                                        Product Name
                                      </label>
                                      <p className="text-base">
                                        {product.name}
                                      </p>
                                    </div>
                                  )}
                                  {product.brand && (
                                    <div>
                                      <label className="text-sm font-semibold text-gray-600">
                                        Brand
                                      </label>
                                      <p className="text-base">
                                        {product.brand}
                                      </p>
                                    </div>
                                  )}
                                  {product.size && (
                                    <div>
                                      <label className="text-sm font-semibold text-gray-600">
                                        Size
                                      </label>
                                      <p className="text-base">
                                        {product.size}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : order.productInfo ? (
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
                            {order.productIds?.map((id, index) => (
                              <Chip key={index} size="sm" variant="flat">
                                {id}
                              </Chip>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <Divider />
                  </>
                )}

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
                      <p className="text-base">{order.userName || order.name}</p>
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
                    {/* Pricing Breakdown */}
                    {order.discount && order.discount > 0 && (
                      <div className="md:col-span-2">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-gray-700">Subtotal:</span>
                            <span className="text-base font-semibold">
                              ${(order.totalAmount + order.discount).toFixed(2)}
                            </span>
                          </div>
                          {order.couponCode && (
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-700">Discount:</span>
                                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded font-mono">
                                  {order.couponCode}
                                </span>
                              </div>
                              <span className="text-base font-semibold text-red-600">
                                -${order.discount.toFixed(2)}
                              </span>
                            </div>
                          )}
                          {!order.couponCode && order.discount > 0 && (
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-semibold text-gray-700">Discount:</span>
                              <span className="text-base font-semibold text-red-600">
                                -${order.discount.toFixed(2)}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                            <span className="text-base font-bold text-gray-900">Total Amount:</span>
                            <span className="text-xl font-bold text-green-600">
                              ${order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {(!order.discount || order.discount === 0) && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Total Amount
                        </label>
                        <p className="text-xl font-bold text-green-600">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Shipping Location
                      </label>
                      <p className="text-base capitalize">
                        {order.shippingLocation?.replace(/([A-Z])/g, ' $1').trim() || 'N/A'}
                      </p>
                    </div>

                    {order.trackingNumber && (
                      <div className="md:col-span-2">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <label className="text-sm font-semibold text-green-700">
                            FedEx Tracking Number
                          </label>
                          <p className="text-lg font-bold font-mono text-green-800 mt-1">
                            {order.trackingNumber}
                          </p>
                        </div>
                      </div>
                    )}

                    {order.couponCode && (!order.discount || order.discount === 0) && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Coupon Code
                        </label>
                        <p className="text-base font-mono bg-orange-50 text-orange-800 px-3 py-1 rounded inline-block">
                          {order.couponCode}
                        </p>
                      </div>
                    )}

                    {order.paymentIntentId && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Payment Intent ID
                        </label>
                        <p className="text-base font-mono">
                          {order.paymentIntentId}
                        </p>
                      </div>
                    )}
                    {order.createdAt && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Order Date
                        </label>
                        <p className="text-base">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                    {order.updatedAt && order.updatedAt !== order.createdAt && (
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

              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              {isEditMode && order.status === "confirmed" && (
                <>
                  <Button
                    color="primary"
                    onPress={() => onShipOrder(order)}
                    isDisabled={loading}
                  >
                    Ship Order
                  </Button>
                  <Button
                    color="danger"
                    onPress={() => handleStatusUpdate("cancelled")}
                    isLoading={loading}
                    isDisabled={loading}
                  >
                    Cancel Order
                  </Button>
                </>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
