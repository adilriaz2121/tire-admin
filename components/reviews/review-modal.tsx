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
  Select,
  SelectItem,
} from "@nextui-org/react";
import { updateReview } from "@/actions/review.action";
import { toast } from "sonner";

import { IReview } from "@/helpers/types";

type Review = IReview;

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
  mode: "edit";
  onSuccess: () => void;
}

export const ReviewModal = ({
  isOpen,
  onClose,
  review,
  mode,
  onSuccess,
}: ReviewModalProps) => {
  const [formData, setFormData] = useState<Partial<IReview>>({
    name: "",
    email: "",
    summary: "",
    additionalComments: "",
    vehicle: "",
    milesDriven: "",
    drivingStyle: "",
    wouldBuyAgain: "",
    Dry: 5,
    Wet: 5,
    Winter: 5,
    Comfort: 5,
    Noise: 5,
    Treadwear: 5,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (review) {
      setFormData({
        name: review.name || "",
        email: review.email || "",
        summary: review.summary || "",
        additionalComments: review.additionalComments || "",
        vehicle: review.vehicle || "",
        milesDriven: review.milesDriven || "",
        drivingStyle: review.drivingStyle || "",
        wouldBuyAgain: review.wouldBuyAgain || "",
        Dry: review.Dry || 5,
        Wet: review.Wet || 5,
        Winter: review.Winter || 5,
        Comfort: review.Comfort || 5,
        Noise: review.Noise || 5,
        Treadwear: review.Treadwear || 5,
      });
    }
  }, [review]);

  const handleSubmit = async () => {
    if (!review) return;

    setLoading(true);
    try {
      const result = await updateReview(review.id, formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Review updated successfully");
        onSuccess();
      }
    } catch (error) {
      toast.error("Failed to update review");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const ratingOptions = [
    { key: "5", label: "5 Stars - Excellent" },
    { key: "4", label: "4 Stars - Good" },
    { key: "3", label: "3 Stars - Average" },
    { key: "2", label: "2 Stars - Poor" },
    { key: "1", label: "1 Star - Very Poor" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold">Edit Review</h3>
          <p className="text-sm text-gray-500">
            Update review details and content
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Reviewer Name"
                placeholder="Enter reviewer name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                isRequired
              />
              <Input
                label="Email"
                placeholder="Enter email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                isRequired
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Vehicle"
                placeholder="Enter vehicle"
                value={formData.vehicle}
                onChange={(e) => handleInputChange("vehicle", e.target.value)}
              />
              <Input
                label="Miles Driven"
                placeholder="Enter miles driven"
                value={formData.milesDriven}
                onChange={(e) => handleInputChange("milesDriven", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Driving Style"
                placeholder="Enter driving style"
                value={formData.drivingStyle}
                onChange={(e) => handleInputChange("drivingStyle", e.target.value)}
              />
              <Input
                label="Would Buy Again"
                placeholder="Yes/No"
                value={formData.wouldBuyAgain}
                onChange={(e) => handleInputChange("wouldBuyAgain", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Select
                label="Dry Rating"
                selectedKeys={[(formData.Dry || 5).toString()]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleInputChange("Dry", parseInt(value));
                }}
              >
                {ratingOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Wet Rating"
                selectedKeys={[(formData.Wet || 5).toString()]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleInputChange("Wet", parseInt(value));
                }}
              >
                {ratingOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Winter Rating"
                selectedKeys={[(formData.Winter || 5).toString()]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleInputChange("Winter", parseInt(value));
                }}
              >
                {ratingOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Comfort Rating"
                selectedKeys={[(formData.Comfort || 5).toString()]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleInputChange("Comfort", parseInt(value));
                }}
              >
                {ratingOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Noise Rating"
                selectedKeys={[(formData.Noise || 5).toString()]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleInputChange("Noise", parseInt(value));
                }}
              >
                {ratingOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Treadwear Rating"
                selectedKeys={[(formData.Treadwear || 5).toString()]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleInputChange("Treadwear", parseInt(value));
                }}
              >
                {ratingOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <Textarea
              label="Summary"
              placeholder="Enter review summary"
              value={formData.summary || ""}
              onChange={(e) => handleInputChange("summary", e.target.value)}
              minRows={3}
            />

            <Textarea
              label="Additional Comments"
              placeholder="Enter additional comments"
              value={formData.additionalComments || ""}
              onChange={(e) => handleInputChange("additionalComments", e.target.value)}
              minRows={3}
            />

            {/* Review Info */}
            {review && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                <p>
                  <strong>Review ID:</strong> {review.id}
                </p>
                <p>
                  <strong>Submitted:</strong>{" "}
                  {new Date(review.createdAt).toLocaleString()}
                </p>
                {review.size && (
                  <p>
                    <strong>Size:</strong> {review.size}
                  </p>
                )}
                {review.brand && (
                  <p>
                    <strong>Brand:</strong> {review.brand}
                  </p>
                )}
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={loading}
            isDisabled={!formData.name?.trim() || !formData.email?.trim()}
          >
            {loading ? "Updating..." : "Update Review"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
