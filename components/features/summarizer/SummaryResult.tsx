"use client"

import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { useEffect, useMemo, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { presentationService } from "@/services/presentation.service"
import type { Presentation, ExportFormat } from "@/constants/presentation.types"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const markdownComponents = {
    p: ({ node, ...props }: any) => (
        <p className="m-0 text-xs sm:text-sm leading-5 sm:leading-7 text-foreground" {...props} />
    ),
    strong: ({ node, ...props }: any) => (
        <strong className="text-sm sm:text-base font-medium text-foreground" {...props} />
    ),
    em: ({ node, ...props }: any) => (
        <em className="not-italic text-foreground" {...props} />
    ),
    ul: ({ node, ...props }: any) => (
        <ul className="ml-5 list-disc space-y-2 text-sm leading-7 text-foreground" {...props} />
    ),
    ol: ({ node, ...props }: any) => (
        <ol className="ml-5 list-decimal space-y-2 text-sm leading-7 text-foreground" {...props} />
    ),
    li: ({ node, ...props }: any) => (
        <li className="text-xs sm:text-sm leading-5 sm:leading-7 text-foreground" {...props} />
    ),
    h1: ({ node, ...props }: any) => (
        <h1 className="text-2xl font-semibold text-foreground" {...props} />
    ),
    h2: ({ node, ...props }: any) => (
        <h2 className="text-base sm:text-xl font-semibold text-foreground" {...props} />
    ),
    h3: ({ node, ...props }: any) => (
        <h3 className="text-sm sm:text-lg font-medium text-foreground" {...props} />
    ),
}

function getSummaryMetadata(summary: string) {
    const words = summary.trim().split(/\s+/).filter(Boolean).length
    const sentences = summary.split(/[.!?]+/).filter(Boolean).length
    const readingTime = `${Math.max(1, Math.round(words / 200))} mins`

    return {
        wordCount: words,
        sentenceCount: sentences,
        readingTime,
    }
}

export default function SummaryResult() {
    const params = useParams()
    const searchParams = useSearchParams()
    const presentationId = Array.isArray(params?.id) ? params?.id[0] : params?.id
    const defaultFormat = searchParams?.get("format") === "docx" ? "docx" : "pdf"

    const [presentation, setPresentation] = useState<Presentation | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isDownloading, setIsDownloading] = useState(false)
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(defaultFormat)

    useEffect(() => {
        if (!presentationId) {
            setIsLoading(false)
            return
        }

        const stored = localStorage.getItem(`presentation-${presentationId}`)
        if (stored) {
            setPresentation(JSON.parse(stored))
            setIsLoading(false)
            return
        }

        const loadPresentation = async () => {
            try {
                const res = await presentationService.getPresentation(presentationId)
                setPresentation(res.presentation ?? null)
            } catch (error) {
                console.error(error)
                toast.error("Unable to load summary result.")
            } finally {
                setIsLoading(false)
            }
        }

        loadPresentation()
    }, [presentationId])

    useEffect(() => {
        setSelectedFormat(defaultFormat)
    }, [defaultFormat])

    const metadata = useMemo(() => {
        return presentation?.summary ? getSummaryMetadata(presentation.summary) : null
    }, [presentation])

    const highlights = useMemo(() => {
        if (!presentation?.summary) {
            return []
        }

        return presentation.summary
            .split(/(?<=[.!?])\s+/)
            .filter(Boolean)
            .slice(0, 4)
    }, [presentation])

    const handleDownload = async (format: ExportFormat) => {
        if (!presentationId || !presentation) {
            return
        }

        setSelectedFormat(format)
        setIsDownloading(true)

        try {
            const blob = await presentationService.downloadPresentation(presentationId, format)
            const url = URL.createObjectURL(blob)
            const anchor = document.createElement("a")
            anchor.href = url
            anchor.download = `${presentation.fileName.replace(/\.pptx$/i, "")}.${format}`
            document.body.appendChild(anchor)
            anchor.click()
            anchor.remove()
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error(error)
            toast.error("Download failed. Please try again.")
        } finally {
            setIsDownloading(false)
        }
    }

    if (!presentationId) {
        return (
            <div className="p-10 text-center text-destructive">
                Invalid summary route. Please start from the summarizer page.
            </div>
        )
    }

    if (isLoading) {
        return <div className="p-10 text-center text-muted-foreground">Loading summary result...</div>
    }

    if (!presentation) {
        return (
            <div className="p-10 text-center text-destructive">
                No summary could be loaded for this presentation.
            </div>
        )
    }

    return (
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="space-y-10">
                <div className="flex flex-col gap-4">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-tertiary transition-colors hover:text-tertiary-foreground"
                    >
                        <span aria-hidden="true">←</span>
                        Back to summarizer
                    </a>

                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-10">
                        <div className="grid gap-8 xl:grid-cols-[2.4fr_1fr] xl:items-end">
                            <div className="space-y-5">
                                <p className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground">Summary Results</p>
                                <h1 className="text-xl sm:text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                    Your presentation summary is ready.
                                </h1>
                                <p className="text-xs sm:text-sm leading-5 sm:leading-7 text-muted-foreground">
                                    Generated key insights, export-ready files, and metrics tailored to your deck.
                                </p>
                            </div>

                            <div className="rounded-xl border border-border bg-background p-6 text-sm text-muted-foreground shadow-xs">
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-[0.65rem] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground">
                                            Selected file
                                        </p>
                                        <p className="mt-3 text-sm sm:text-base font-semibold text-foreground">{presentation.fileName}</p>
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-xl bg-muted p-4">
                                            <p className="text-[0.65rem] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground">
                                                Status
                                            </p>
                                            <p className="mt-2 text-xs sm:text-sm font-semibold text-foreground">{presentation.status}</p>
                                        </div>
                                        <div className="rounded-xl bg-muted p-4">
                                            <p className="text-[0.65rem] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground">
                                                Detail level
                                            </p>
                                            <p className="mt-2 text-xs sm:text-sm font-semibold text-foreground">{presentation.summaryDetail}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 xl:grid-cols-[2.5fr_1fr]">
                    <Card className="h-full w-full rounded-xl p-5 sm:p-10">
                        <CardHeader className="space-y-4 p-0">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-tertiary/10 text-tertiary">
                                    <span className="text-lg font-semibold">✓</span>
                                </div>
                                <div className="space-y-3">
                                    <CardTitle>Key Highlights</CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">
                                        Captured from your deck and surfaced as executive insights.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-8 p-0">
                            <div className="grid gap-4 sm:grid-cols-2">
                                {highlights.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex h-full min-h-[190px] flex-col justify-between rounded-xl border border-border bg-background p-6"
                                    >
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-tertiary-foreground">
                                                {`0${index + 1}`}
                                            </p>
                                            <div className="mt-3 space-y-2">
                                                <ReactMarkdown components={markdownComponents}>
                                                    {item}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="rounded-xl border border-border bg-muted p-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-tertiary">Full summary</p>
                                    <span className="inline-flex rounded-full border border-ring bg-background px-3 py-1 text-[10px] sm:text-xs uppercase text-muted-foreground">
                                        {metadata?.readingTime} read
                                    </span>
                                </div>
                                <div className="mt-4 max-h-[320px] overflow-y-auto text-sm leading-7 text-foreground">
                                    <div className="prose prose-invert max-w-none text-foreground">
                                        <ReactMarkdown components={markdownComponents}>
                                            {presentation.summary}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                                <Button
                                    type="button"
                                    size="lg"
                                    className="text-sm sm:text-base w-full cursor-pointer bg-tertiary text-white hover:bg-tertiary-foreground sm:w-auto"
                                    disabled={isDownloading}
                                    onClick={() => handleDownload("pdf")}
                                >
                                    {"[ Download PDF ]"}
                                </Button>
                                <Button
                                    type="button"
                                    size="lg"
                                    className="text-sm sm:text-base w-full cursor-pointer bg-transparent border border-tertiary text-primary hover:bg-tertiary hover:text-white sm:w-auto"
                                    disabled={isDownloading}
                                    onClick={() => handleDownload("docx")}
                                >
                                    {"[ Download DOCX ]"}
                                </Button>
                            </div>
                            <div className="rounded-3xl bg-background px-4 py-3 text-xs sm:text-sm text-muted-foreground">
                                Generated by AI Summarizer Pro with a precision-driven summary engine.
                            </div>
                        </CardFooter>
                    </Card>

                    <Card className="h-full w-full rounded-xl p-5 sm:p-10">
                        <CardHeader className="p-0">
                            <CardTitle>Metadata</CardTitle>
                            <CardDescription>Summary metrics and output details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5 p-0">
                            <div className="grid gap-4">
                                <div className="rounded-xl border border-border bg-background p-5">
                                    <p className="text-[0.65rem] uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground">Word Count</p>
                                    <p className="mt-3 text-xl sm:text-2xl font-semibold text-foreground">{metadata?.wordCount ?? "-"}</p>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-xl border border-border bg-background p-5">
                                        <p className="text-[0.65rem] uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground">Sentences</p>
                                        <p className="mt-3 text-xl sm:text-2xl font-semibold text-foreground">{metadata?.sentenceCount ?? "-"}</p>
                                    </div>
                                    <div className="rounded-xl border border-border bg-background p-5">
                                        <p className="text-[0.65rem] uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground">Reading Time</p>
                                        <p className="mt-3 text-xl sm:text-2xl font-semibold text-foreground">{metadata?.readingTime ?? "-"}</p>
                                    </div>
                                </div>
                                <div className="rounded-xl border border-border bg-background p-5">
                                    <p className="text-[0.65rem] uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground">Detail Level</p>
                                    <p className="mt-3 text-xl sm:text-2xl font-semibold text-foreground">{presentation.summaryDetail}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
