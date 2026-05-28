import axiosInstance from "@/lib/axios"

export type SummaryDetail = "SHORT" | "MEDIUM" | "DEEP_DIVE"
export type ExportFormat = "pdf" | "docx"

export type Presentation = {
  id: string
  fileName: string
  summary: string | null
  status: string
  summaryDetail: string
  createdAt: string
  updatedAt: string
}

export type UploadPresentationResponse = {
  code: number
  status: string
  message: string
  data?: {
    presentation: Presentation
    metadata?: {
      tokens: number
      durationMs: number
      wordCount: number
    }
  }
}

export type GetPresentationResponse = {
  code: number
  status: string
  data?: {
    presentation: Presentation
  }
}

export const presentationService = {
  uploadPresentation: async (formData: FormData) => {
    const response = await axiosInstance.post("api/presentations/v1/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data as UploadPresentationResponse
  },

  getPresentation: async (id: string) => {
    const response = await axiosInstance.get(`api/presentations/v1/${id}`)
    return response.data as GetPresentationResponse
  },

  downloadPresentation: async (id: string, format: ExportFormat) => {
    const response = await axiosInstance.get(`api/presentations/v1/${id}/download`, {
      responseType: "blob",
      params: { format },
    })
    return response.data as Blob
  },
}
