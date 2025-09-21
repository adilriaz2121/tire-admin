"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Image,
  Chip,
} from "@nextui-org/react";
import { IProduct } from "@/helpers/types";
import { getProductById } from "@/actions/product.action";
import { toast } from "sonner";

interface ViewProductModalProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewProductModal: React.FC<ViewProductModalProps> = ({
  productId,
  isOpen,
  onClose,
}) => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && productId) {
      fetchProduct();
    }
  }, [isOpen, productId]);

  const fetchProduct = async () => {
    if (!productId) return;

    setLoading(true);
    try {
      console.log("Fetching product with ID:", productId);
      const result = await getProductById(productId);
      console.log("Product fetch result:", result);

      if (result.error) {
        console.error("Product fetch error:", result.error);
        toast.error(result.error);
        onClose();
      } else {
        console.log("Product data:", result.data!.product);
        setProduct(result.data!.product);
      }
    } catch (error) {
      console.error("Product fetch exception:", error);
      toast.error("Failed to fetch product details");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (!price || isNaN(price)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleClose = () => {
    setProduct(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Product Details
        </ModalHeader>
        <ModalBody>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="lg" />
            </div>
          ) : product ? (
            <div className="space-y-6">
              {/* Product Images */}
              {product.images && product.images.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {product.images.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                        fallbackSrc="https://via.placeholder.com/300x200?text=No+Image"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Make
                    </label>
                    <p className="text-lg font-semibold">
                      {product.make || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Model
                    </label>
                    <p className="text-lg font-semibold">
                      {product.model || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Year
                    </label>
                    <p className="text-lg font-semibold">
                      {product.year || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Trim
                    </label>
                    <p className="text-lg font-semibold">
                      {product.trim || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Size
                    </label>
                    <p className="text-lg font-semibold">
                      {product.size || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Manufacturer
                    </label>
                    <p className="text-lg font-semibold">
                      {product.mfg || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Item Number
                    </label>
                    <p className="text-lg font-semibold">
                      {product.item || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <div className="mt-1">
                      <Chip
                        color={product.isActive ? "success" : "danger"}
                        size="sm"
                        variant="flat"
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </Chip>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing and Inventory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Price
                  </label>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Quantity
                  </label>
                  <p className="text-2xl font-bold text-[#FF7101]">
                    {product.quantity}
                  </p>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Description
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {product.description || "No description available"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Details
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {product.detail || "No details available"}
                  </p>
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Created At
                  </label>
                  <p className="text-sm text-gray-600">
                    {product.createdAt
                      ? new Date(product.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Updated At
                  </label>
                  <p className="text-sm text-gray-600">
                    {product.updatedAt
                      ? new Date(product.updatedAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No product data available</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
