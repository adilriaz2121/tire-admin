"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
} from "@nextui-org/react";
import { ICoupon } from "@/helpers/types";
import { createCoupon, updateCoupon } from "@/actions/coupon.action";
import { toast } from "sonner";

interface CouponModalProps {
  coupon: ICoupon | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CouponModal: React.FC<CouponModalProps> = ({
  coupon,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discount: 0,
    validFrom: "",
    validTo: "",
    maxUse: "",
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discount: coupon.discount,
        validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : "",
        validTo: coupon.validTo ? new Date(coupon.validTo).toISOString().split('T')[0] : "",
        maxUse: coupon.maxUse?.toString() || "",
        isActive: coupon.isActive,
      });
    } else {
      setFormData({
        code: "",
        discountType: "percentage",
        discount: 0,
        validFrom: "",
        validTo: "",
        maxUse: "",
        isActive: true,
      });
    }
  }, [coupon, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.code || formData.code.trim() === "") {
      toast.error("Coupon code is required");
      return;
    }

    if (formData.discount <= 0) {
      toast.error("Discount must be greater than 0");
      return;
    }

    // Validate discount based on type
    if (formData.discountType === "percentage" && formData.discount > 100) {
      toast.error("Percentage discount cannot exceed 100%");
      return;
    }

    // Validate date range
    if (formData.validFrom && formData.validTo) {
      const fromDate = new Date(formData.validFrom);
      const toDate = new Date(formData.validTo);
      if (fromDate > toDate) {
        toast.error("Valid From date must be before Valid To date");
        return;
      }
    }

    // Validate max use
    if (formData.maxUse && parseInt(formData.maxUse) <= 0) {
      toast.error("Max usage must be a positive number");
      return;
    }

    setIsLoading(true);

    try {
      const couponData = {
        code: formData.code.trim().toUpperCase(),
        discountType: formData.discountType,
        discount: formData.discount,
        validFrom: formData.validFrom ? new Date(formData.validFrom).toISOString() : undefined,
        validTo: formData.validTo ? new Date(formData.validTo).toISOString() : undefined,
        maxUse: formData.maxUse && formData.maxUse.trim() !== "" ? parseInt(formData.maxUse) : undefined,
        isActive: formData.isActive,
      };

      let result;
      if (coupon) {
        result = await updateCoupon(coupon.id, couponData);
      } else {
        result = await createCoupon(couponData);
      }

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(coupon ? "Coupon updated successfully" : "Coupon created successfully");
        onClose();
        window.location.reload();
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {coupon ? "Edit Coupon" : "Create Coupon"}
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Coupon Code"
              placeholder="Enter coupon code"
              value={formData.code}
              onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
              isRequired
            />
            
            <div className="flex gap-4">
              <Select
                label="Discount Type"
                placeholder="Select discount type"
                selectedKeys={[formData.discountType]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as "percentage" | "fixed";
                  handleInputChange("discountType", value || "percentage");
                }}
                isRequired
              >
                <SelectItem key="percentage" value="percentage">
                  Percentage
                </SelectItem>
                <SelectItem key="fixed" value="fixed">
                  Fixed Amount
                </SelectItem>
              </Select>

              <Input
                label="Discount Value"
                placeholder="Enter discount value"
                type="number"
                min={0}
                max={formData.discountType === "percentage" ? 100 : undefined}
                step={formData.discountType === "percentage" ? 0.01 : 0.01}
                value={formData.discount.toString()}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  const maxValue = formData.discountType === "percentage" ? 100 : undefined;
                  handleInputChange("discount", maxValue ? Math.min(value, maxValue) : value);
                }}
                isRequired
                endContent={
                  formData.discountType === "percentage" ? "%" : "$"
                }
              />
            </div>

            <div className="flex gap-4">
              <Input
                label="Valid From"
                type="date"
                value={formData.validFrom}
                onChange={(e) => handleInputChange("validFrom", e.target.value)}
                description="Optional start date"
                max={formData.validTo || undefined}
              />
              
              <Input
                label="Valid To"
                type="date"
                value={formData.validTo}
                onChange={(e) => handleInputChange("validTo", e.target.value)}
                description="Optional expiry date"
                min={formData.validFrom || undefined}
              />
            </div>

            <Input
              label="Max Usage"
              placeholder="Enter maximum usage (optional)"
              type="number"
              min={1}
              value={formData.maxUse}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || parseInt(value) > 0) {
                  handleInputChange("maxUse", value);
                }
              }}
              description="Leave empty for unlimited usage"
            />

            <div className="flex items-center gap-2">
              <Switch
                isSelected={formData.isActive}
                onValueChange={(value) => handleInputChange("isActive", value)}
              />
              <span className="text-sm">Active</span>
            </div>
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
            isDisabled={!formData.code || formData.discount <= 0}
          >
            {coupon ? "Update" : "Create"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
