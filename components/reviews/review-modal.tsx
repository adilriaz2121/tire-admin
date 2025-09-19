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

interface Review {
  id: string;
  name: string;
  country: string;
  review: string;
  rating: number;
  createdAt: string;
  productsId?: string;
}

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
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    review: "",
    rating: 5,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (review) {
      setFormData({
        name: review.name,
        country: review.country || "",
        review: review.review,
        rating: review.rating,
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
                label="Country"
                placeholder="Enter country"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
              />
            </div>

            <Select
              label="Rating"
              placeholder="Select rating"
              selectedKeys={[formData.rating.toString()]}
              onChange={(e) =>
                handleInputChange("rating", parseInt(e.target.value))
              }
              isRequired
            >
              {ratingOptions.map((option) => (
                <SelectItem key={option.key} value={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>

            <Textarea
              label="Review Content"
              placeholder="Enter review content"
              value={formData.review}
              onChange={(e) => handleInputChange("review", e.target.value)}
              minRows={4}
              maxRows={8}
              isRequired
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
                {review.productsId && (
                  <p>
                    <strong>Product ID:</strong> {review.productsId}
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
            isDisabled={!formData.name.trim() || !formData.review.trim()}
          >
            {loading ? "Updating..." : "Update Review"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
