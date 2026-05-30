"use client"

import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/context/AuthContext"
import FileUpload from "@/components/features/summarizer/FileUpload"
import { presentationService } from "@/services/presentation.service"
import type { SummaryDetail, ExportFormat } from "@/constants/presentation.types"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"

export default function GenerateSummary() {
    const { user } = useAuth()
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [summaryDetail, setSummaryDetail] = useState<SummaryDetail>("MEDIUM")
    const [exportFormat, setExportFormat] = useState<ExportFormat>("pdf")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleGenerateSummary = async () => {
        if (!selectedFile) {
            toast.error("Please select a PowerPoint file before generating a summary.")
            return
        }

        const formData = new FormData()
        formData.append("file", selectedFile)
        formData.append("summaryDetail", summaryDetail)

        setIsLoading(true)

        try {
            const result = await presentationService.uploadPresentation(formData)
            const presentation = result.presentation

            if (!presentation?.id) {
                throw new Error("Invalid summary response")
            }

            localStorage.setItem(`presentation-${presentation.id}`, JSON.stringify(presentation))

            router.push(`/results/${presentation.id}?format=${exportFormat}`)
        } catch (error) {
            console.error(error)
            toast.error("Unable to generate summary. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col justify-center items-center gap-10 max-w-5xl mx-auto">
            <h1 className="font-medium text-xs sm:text-xl text-center">Welcome back, {user?.name}! Ready to condense your presentation deck into key highlights?</h1>
            <div className="w-full space-y-3">
                <FileUpload selectedFile={selectedFile} onFileSelect={setSelectedFile} />
                <p className="text-center text-muted-foreground text-xs sm:text-sm">{"(Supports: .pptx)"}</p>
            </div>
            <div className="flex flex-col w-full border border-ring bg-sidebar rounded-lg p-7 gap-5">
                <p className="text-sm sm:text-base text-tertiary">AI CONFIGURATIONS:</p>
                <FieldGroup className="w-full flex-row justify-center">
                    <FieldSet className="w-full">
                        <FieldLegend className="text-sm sm:text-base w-max">Summary Detail:</FieldLegend>
                        <FieldGroup className="gap-4 text-muted-foreground">
                            <Field orientation="horizontal">
                                <Checkbox
                                    className="bg-background rounded-full h-4 w-4 sm:h-5 sm:w-5 border-ring"
                                    id="short"
                                    checked={summaryDetail === "SHORT"}
                                    onCheckedChange={(value) => value && setSummaryDetail("SHORT")}
                                />
                                <FieldLabel className="text-xs sm:text-base" htmlFor="short">Short</FieldLabel>
                            </Field>
                            <Field orientation="horizontal">
                                <Checkbox
                                    className="bg-background rounded-full h-4 w-4 sm:h-5 sm:w-5 border-ring"
                                    id="medium"
                                    checked={summaryDetail === "MEDIUM"}
                                    onCheckedChange={(value) => value && setSummaryDetail("MEDIUM")}
                                />
                                <FieldLabel className="text-xs sm:text-base" htmlFor="medium">Medium</FieldLabel>
                            </Field>
                            <Field orientation="horizontal">
                                <Checkbox
                                    className="bg-background rounded-full h-4 w-4 sm:h-5 sm:w-5 border-ring"
                                    id="deep_dive"
                                    checked={summaryDetail === "DEEP_DIVE"}
                                    onCheckedChange={(value) => value && setSummaryDetail("DEEP_DIVE")}
                                />
                                <FieldLabel className="text-xs sm:text-base" htmlFor="deep_dive">Deep Dive</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSet className="w-full">
                        <FieldLegend className="text-sm sm:text-base w-max">Export Format:</FieldLegend>
                        <FieldGroup className="gap-4 text-muted-foreground">
                            <Field className="w-max" orientation="horizontal">
                                <Checkbox
                                    className="bg-background rounded-full h-4 w-4 sm:h-5 sm:w-5 border-ring"
                                    id="docs"
                                    checked={exportFormat === "docx"}
                                    onCheckedChange={(value) => value && setExportFormat("docx")}
                                />
                                <FieldLabel className="text-xs sm:text-base" htmlFor="docs">Word Document {"(.docx)"}</FieldLabel>
                            </Field>
                            <Field className="w-full" orientation="horizontal">
                                <Checkbox
                                    className="bg-background rounded-full h-4 w-4 sm:h-5 sm:w-5 border-ring break-words"
                                    id="ppt"
                                    checked={exportFormat === "pdf"}
                                    onCheckedChange={(value) => value && setExportFormat("pdf")}
                                />
                                <FieldLabel className="text-xs sm:text-base" htmlFor="ppt">PowerPoint Presentation {"(.pptx)"}</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </FieldGroup>
            </div>
            <Button
                type="button"
                disabled={!selectedFile || isLoading}
                className=" sm:text-2xl p-5 sm:p-7 bg-tertiary hover:bg-tertiary-foreground text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleGenerateSummary}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkle-icon lucide-sparkle">
                    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
                </svg>
                {isLoading ? "Generating Summary..." : "Generate Summary"}
            </Button>
        </div>
    )
}