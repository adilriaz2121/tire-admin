"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Switch,
} from "@nextui-org/react";
import { IProduct } from "@/helpers/types";
import { createProduct, updateProduct } from "@/actions/product.action";
import { toast } from "sonner";
import axios from "axios";

interface ProductModalProps {
  product: IProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    trim: "",
    size: "",
    mfg: "",
    item: "",
    detail: "",
    description: "",
    quantity: 0,
    price: 0,
    images: [] as string[],
    isActive: true,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        make: product.make || "",
        model: product.model || "",
        year: product.year || "",
        trim: product.trim || "",
        size: product.size || "",
        mfg: product.mfg || "",
        item: product.item || "",
        detail: product.detail || "",
        description: product.description || "",
        quantity: product.quantity || 0,
        price: product.price || 0,
        images: product.images || [],
        isActive: product.isActive ?? true,
      });
    } else {
      setFormData({
        make: "",
        model: "",
        year: "",
        trim: "",
        size: "",
        mfg: "",
        item: "",
        detail: "",
        description: "",
        quantity: 0,
        price: 0,
        images: [],
        isActive: true,
      });
    }
    setImageFiles([]);
  }, [product, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("admin-token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      return response.data.data.url;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async () => {
    if (
      !formData.make ||
      !formData.model ||
      !formData.year ||
      !formData.size ||
      !formData.mfg ||
      !formData.item
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.quantity < 0 || formData.price < 0) {
      toast.error("Quantity and price must be non-negative");
      return;
    }

    setIsLoading(true);

    try {
      let imageUrls = [...formData.images];

      // Upload new images if provided
      if (imageFiles.length > 0) {
        const uploadedUrls = await uploadImages(imageFiles);
        imageUrls = [...imageUrls, ...uploadedUrls];
      }

      const productData = {
        make: formData.make,
        model: formData.model,
        year: formData.year,
        trim: formData.trim,
        size: formData.size,
        mfg: formData.mfg,
        item: formData.item,
        detail: formData.detail,
        description: formData.description,
        quantity: formData.quantity,
        price: formData.price,
        images: imageUrls,
        isActive: formData.isActive,
      };

      let result;
      if (product) {
        result = await updateProduct(product.id, productData);
      } else {
        result = await createProduct(productData);
      }

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          product
            ? "Product updated successfully"
            : "Product created successfully"
        );
        onClose();
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {product ? "Edit Product" : "Add New Product"}
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Make *"
              placeholder="Enter make (e.g., Michelin)"
              value={formData.make}
              onChange={(e) => handleInputChange("make", e.target.value)}
              isRequired
            />
            <Input
              label="Model"
              placeholder="Enter model"
              value={formData.model}
              onChange={(e) => handleInputChange("model", e.target.value)}
            />
            <Input
              label="Year *"
              placeholder="Enter year"
              value={formData.year}
              onChange={(e) => handleInputChange("year", e.target.value)}
              isRequired
            />
            <Input
              label="Trim"
              placeholder="Enter trim level"
              value={formData.trim}
              onChange={(e) => handleInputChange("trim", e.target.value)}
            />
            <Input
              label="Size *"
              placeholder="Enter size (e.g., 225/45R17)"
              value={formData.size}
              onChange={(e) => handleInputChange("size", e.target.value)}
              isRequired
            />
            <Input
              label="Manufacturer *"
              placeholder="Enter manufacturer"
              value={formData.mfg}
              onChange={(e) => handleInputChange("mfg", e.target.value)}
              isRequired
            />
            <Input
              label="Item Number *"
              placeholder="Enter item number"
              value={formData.item}
              onChange={(e) => handleInputChange("item", e.target.value)}
              isRequired
            />
            <Input
              label="Detail"
              placeholder="Enter product detail"
              value={formData.detail}
              onChange={(e) => handleInputChange("detail", e.target.value)}
            />
            <Input
              label="Quantity"
              type="number"
              placeholder="Enter quantity"
              value={formData.quantity.toString()}
              onChange={(e) =>
                handleInputChange("quantity", parseInt(e.target.value) || 0)
              }
              min="0"
            />
            <Input
              label="Price"
              type="number"
              placeholder="Enter price"
              value={formData.price.toString()}
              onChange={(e) =>
                handleInputChange("price", parseFloat(e.target.value) || 0)
              }
              min="0"
              step="0.01"
            />
          </div>

          <Textarea
            label="Description"
            placeholder="Enter product description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={4}
          />

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Product Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Select multiple images to upload
              </p>
            </div>

            {formData.images.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Current Images
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.images.filter(
                            (_, i) => i !== index
                          );
                          handleInputChange("images", newImages);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Switch
              isSelected={formData.isActive}
              onValueChange={(value) => handleInputChange("isActive", value)}
            />
            <span className="text-sm text-gray-700">Active</span>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            {product ? "Update" : "Create"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
