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

export type UploadPresentationResult = {
  presentation?: Presentation
  metadata?: {
    tokens: number
    durationMs: number
    wordCount: number
  }
}

export type GetPresentationResult = {
  presentation?: Presentation
}
