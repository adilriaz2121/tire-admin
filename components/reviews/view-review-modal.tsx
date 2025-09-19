"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
} from "@nextui-org/react";

interface Review {
  id: string;
  name: string;
  country: string;
  review: string;
  rating: number;
  createdAt: string;
  productsId?: string;
}

interface ViewReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
}

export const ViewReviewModal = ({ isOpen, onClose, review }: ViewReviewModalProps) => {
  if (!review) return null;

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "success";
    if (rating >= 3) return "warning";
    return "danger";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold">Review Details</h3>
          <p className="text-sm text-gray-500">Review ID: {review.id}</p>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {/* Review Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">
                    {review.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{review.name}</h4>
                  <p className="text-sm text-gray-500">
                    {review.country || 'Location not specified'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  {renderStars(review.rating)}
                </div>
                <Chip
                  color={getRatingColor(review.rating)}
                  variant="flat"
                  size="sm"
                >
                  {review.rating} out of 5
                </Chip>
              </div>
            </div>

            {/* Review Content */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-700 mb-2">Review Content:</h5>
              <p className="text-gray-600 leading-relaxed">
                {review.review}
              </p>
            </div>

            {/* Review Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <h6 className="font-medium text-blue-800 mb-1">Submitted Date</h6>
                <p className="text-blue-600 text-sm">
                  {formatDate(review.createdAt)}
                </p>
              </div>
              {review.productsId && (
                <div className="bg-green-50 rounded-lg p-3">
                  <h6 className="font-medium text-green-800 mb-1">Product ID</h6>
                  <p className="text-green-600 text-sm font-mono">
                    {review.productsId}
                  </p>
                </div>
              )}
            </div>

            {/* Rating Breakdown */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h6 className="font-medium text-yellow-800 mb-3">Rating Details</h6>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                </div>
                <div className="text-sm text-yellow-700">
                  <p>
                    {review.rating === 5 && "Excellent"}
                    {review.rating === 4 && "Good"}
                    {review.rating === 3 && "Average"}
                    {review.rating === 2 && "Poor"}
                    {review.rating === 1 && "Very Poor"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
