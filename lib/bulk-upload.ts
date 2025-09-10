import axios from "axios";

export async function bulkUploadProducts(file: File): Promise<{ data?: { success: number; failed: number; errors: string[] }; error?: string }> {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('admin-token');
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products/bulk-upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
        
        return { data: response.data.results };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Bulk upload failed";
        return { error: errorMessage };
    }
}
