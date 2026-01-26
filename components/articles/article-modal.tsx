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
  Textarea,
} from "@nextui-org/react";
import { IArticle } from "@/helpers/types";
import { createArticle, updateArticle } from "@/actions/article.action";
import axios from "axios";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () =>
    import("./rich-text-editor").then((mod) => ({
      default: mod.RichTextEditor,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] bg-gray-100 rounded animate-pulse" />
    ),
  }
);

interface ArticleModalProps {
  article: IArticle | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    detail: "",
    content: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        detail: article.detail,
        content: article.content,
        image: article.image,
      });
    } else {
      setFormData({
        title: "",
        detail: "",
        content: "",
        image: "",
      });
    }
    setImageFile(null);
  }, [article, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.detail || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = formData.image;

      // Upload new image if provided
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        try {
          // Get token from localStorage for client-side request
          const token = localStorage.getItem("admin-token");
          console.log("Token found:", token ? "Yes" : "No");
          console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL);

          const uploadResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/upload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                ...(token && { Authorization: `Bearer ${token}` }),
              },
            }
          );
          console.log("Upload response:", uploadResponse.data);
          imageUrl = uploadResponse.data.data.url;
        } catch (uploadError: any) {
          console.error("Upload error:", uploadError);
          console.error("Upload error response:", uploadError.response?.data);
          toast.error(
            uploadError.response?.data?.error ||
            uploadError.message ||
            "Image upload failed"
          );
          setIsLoading(false);
          return;
        }
      }

      const articleData = {
        title: formData.title,
        detail: formData.detail,
        content: formData.content,
        image: imageUrl,
      };

      let result;
      if (article) {
        result = await updateArticle(article.id, articleData);
      } else {
        result = await createArticle(articleData);
      }

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          article
            ? "Article updated successfully"
            : "Article created successfully"
        );
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
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {article ? "Edit Article" : "Create Article"}
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Title"
              placeholder="Enter article title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              isRequired
            />

            <Textarea
              label="Detail"
              placeholder="Enter article detail/summary"
              value={formData.detail}
              onChange={(e) => handleInputChange("detail", e.target.value)}
              isRequired
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#05CB14] hover:file:bg-orange-100"
              />
              {(formData.image || imageFile) && (
                <div className="mt-2">
                  <img
                    src={
                      imageFile
                        ? URL.createObjectURL(imageFile)
                        : formData.image
                    }
                    alt="Current banner"
                    className="w-32 h-20 object-cover rounded border"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {imageFile ? "New image selected" : "Current image"}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => handleInputChange("content", content)}
              />
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
            isDisabled={
              !formData.title || !formData.detail || !formData.content
            }
          >
            {article ? "Update" : "Create"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
