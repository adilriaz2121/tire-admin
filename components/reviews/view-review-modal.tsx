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

import { IReview } from "@/helpers/types";

type Review = IReview;

interface ViewReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
}

export const ViewReviewModal = ({
  isOpen,
  onClose,
  review,
}: ViewReviewModalProps) => {
  if (!review) return null;

  const calculateAverageRating = (review: Review): number => {
    const ratings = [
      review.Dry,
      review.Wet,
      review.Winter,
      review.Comfort,
      review.Noise,
      review.Treadwear,
    ];
    const sum = ratings.reduce((a, b) => a + b, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "success";
    if (rating >= 3) return "warning";
    return "danger";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
          }`}
      >
        ★
      </span>
    ));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
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
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-black font-semibold text-lg">
                    {review.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-black">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.email}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  {renderStars(calculateAverageRating(review))}
                </div>
                <Chip
                  variant="flat"
                  size="sm"
                  className="bg-gray-100 text-black"
                >
                  {calculateAverageRating(review).toFixed(1)} / 5.0
                </Chip>
              </div>
            </div>

            {/* Product Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <h6 className="font-medium text-gray-700 mb-1">Brand</h6>
                <p className="text-black text-sm font-semibold">{review.brand}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <h6 className="font-medium text-gray-700 mb-1">Size</h6>
                <p className="text-black text-sm font-semibold">{review.size}</p>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h6 className="font-medium text-gray-700 mb-3">
                Category Ratings
              </h6>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-gray-600">Dry</p>
                  <div className="flex items-center gap-1">
                    {renderStars(review.Dry)}
                    <span className="text-sm font-semibold text-black">{review.Dry}/5</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Wet</p>
                  <div className="flex items-center gap-1">
                    {renderStars(review.Wet)}
                    <span className="text-sm font-semibold text-black">{review.Wet}/5</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Winter</p>
                  <div className="flex items-center gap-1">
                    {renderStars(review.Winter)}
                    <span className="text-sm font-semibold text-black">{review.Winter}/5</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Comfort</p>
                  <div className="flex items-center gap-1">
                    {renderStars(review.Comfort)}
                    <span className="text-sm font-semibold text-black">{review.Comfort}/5</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Noise</p>
                  <div className="flex items-center gap-1">
                    {renderStars(review.Noise)}
                    <span className="text-sm font-semibold text-black">{review.Noise}/5</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Treadwear</p>
                  <div className="flex items-center gap-1">
                    {renderStars(review.Treadwear)}
                    <span className="text-sm font-semibold text-black">{review.Treadwear}/5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Content */}
            {review.summary && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-700 mb-2">Summary</h5>
                <p className="text-gray-600 leading-relaxed">{review.summary}</p>
              </div>
            )}

            {review.additionalComments && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-700 mb-2">Additional Comments</h5>
                <p className="text-gray-600 leading-relaxed">{review.additionalComments}</p>
              </div>
            )}

            {/* Vehicle & Purchase Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <h6 className="font-medium text-gray-700 mb-1">Vehicle</h6>
                <p className="text-black text-sm">{review.vehicle}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <h6 className="font-medium text-gray-700 mb-1">Miles Driven</h6>
                <p className="text-black text-sm">{review.milesDriven}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <h6 className="font-medium text-gray-700 mb-1">Driving Style</h6>
                <p className="text-black text-sm capitalize">{review.drivingStyle}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <h6 className="font-medium text-gray-700 mb-1">Would Buy Again</h6>
                <p className="text-black text-sm capitalize">{review.wouldBuyAgain}</p>
              </div>
            </div>

            {/* Review Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <h6 className="font-medium text-gray-700 mb-1">Purchase Date</h6>
                <p className="text-black text-sm">
                  {new Date(review.purchaseDate).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <h6 className="font-medium text-gray-700 mb-1">Submitted Date</h6>
                <p className="text-black text-sm">
                  {formatDate(review.createdAt)}
                </p>
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
