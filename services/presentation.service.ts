import axiosInstance from "@/lib/axios"
import type {
  ExportFormat,
  Presentation,
  UploadPresentationResult,
  GetPresentationResult,
} from "@/constants/presentation.types"

export const presentationService = {
  uploadPresentation: async (formData: FormData): Promise<UploadPresentationResult> => {
    const response = await axiosInstance.post("/api/presentations/v1/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data?.data ?? {}
  },

  getAll: async (): Promise<Presentation[]> => {
    const response = await axiosInstance.get("/api/presentations/v1")
    return response.data?.data?.presentations ?? []
  },

  getPresentation: async (id: string): Promise<GetPresentationResult> => {
    const response = await axiosInstance.get(`/api/presentations/v1/${id}`)
    return response.data?.data ?? {}
  },

  downloadPresentation: async (id: string, format: ExportFormat) => {
    const response = await axiosInstance.get(`/api/presentations/v1/${id}/download`, {
      responseType: "blob",
      params: { format },
    })
    return response.data as Blob
  },
}
