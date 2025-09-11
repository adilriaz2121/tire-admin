"use client";

import React, { useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Progress,
} from "@nextui-org/react";
import { bulkUploadProducts } from "@/lib/bulk-upload";
import { toast } from "sonner";

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a CSV or Excel file");
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error(
          `File size too large. Maximum allowed size is 5MB. Your file size: ${(
            file.size /
            (1024 * 1024)
          ).toFixed(2)}MB`
        );
        return;
      }

      setSelectedFile(file);
      setUploadResults(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const event = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(event);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResults(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await bulkUploadProducts(selectedFile);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.error) {
        toast.error(result.error);
      } else {
        setUploadResults(result.data!);
        toast.success(
          `Bulk upload completed! ${result.data!.success} products created, ${
            result.data!.failed
          } failed.`
        );

        // Reset form after successful upload
        setTimeout(() => {
          setSelectedFile(null);
          setUploadProgress(0);
          setUploadResults(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          onClose();
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      setUploadProgress(0);
      setUploadResults(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
    }
  };

  const downloadTemplate = () => {
    // Create a sample CSV template
    const csvContent = `Make ,Model,Year ,Trim,Size,Mfg,Item,Description,Qty,desc,Price,pictures
Michelin,Pilot Sport 4,2023,Summer,225/45R17,Michelin,12345,High performance summer tire,50,Ultra high performance summer tire for sports cars,150.00,https://example.com/tire1.jpg
Bridgestone,Potenza RE-71R,2023,Summer,245/40R18,Bridgestone,67890,Track focused summer tire,25,Extreme performance summer tire for track use,200.00,https://example.com/tire2.jpg`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      isDismissable={!isUploading}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Bulk Upload Products
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                File Format Requirements:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Supported formats: CSV, Excel (.xlsx, .xls)</li>
                <li>• Maximum file size: 5MB</li>
                <li>
                  • Required columns: Make, Model, Year, Trim, Size, Mfg, Item,
                  Description, Qty, desc, Price ,pictures
                </li>
              </ul>
            </div>

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                selectedFile
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />

              {selectedFile ? (
                <div className="space-y-2">
                  <div className="text-green-600 text-lg">✓</div>
                  <p className="font-medium text-green-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-green-700">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <Button
                    size="sm"
                    variant="light"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    disabled={isUploading}
                  >
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-4xl text-gray-400">📁</div>
                  <p className="text-gray-600">
                    Drag and drop your file here, or{" "}
                    <button
                      className="text-blue-600 hover:text-blue-800 underline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-sm text-gray-500">
                    CSV or Excel files only, max 5MB
                  </p>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            {/* Upload Results */}
            {uploadResults && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Upload Results:
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="text-green-600">
                    ✓ {uploadResults.success} products created successfully
                  </p>
                  <p className="text-red-600">
                    ✗ {uploadResults.failed} products failed
                  </p>
                  {uploadResults.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium text-red-800">Errors:</p>
                      <ul className="text-red-700 text-xs space-y-1 max-h-20 overflow-y-auto">
                        {uploadResults.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Template Download */}
            <div className="text-center">
              <Button
                variant="light"
                size="sm"
                onClick={downloadTemplate}
                disabled={isUploading}
              >
                Download CSV Template
              </Button>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={handleClose}
            isDisabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleUpload}
            isLoading={isUploading}
            isDisabled={!selectedFile || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Products"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
