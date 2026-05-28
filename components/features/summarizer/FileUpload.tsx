"use client"

import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type FileUploadProps = {
    selectedFile: File | null
    onFileSelect: (file: File | null) => void
}

export default function FileUpload({ selectedFile, onFileSelect }: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => setIsDragging(false)

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) {
            onFileSelect(file)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        onFileSelect(file ?? null)
    }

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-3 w-full rounded-xl border-2 border-dashed p-12 transition-colors ${isDragging ? "border-tertiary bg-tertiary/10" : "border-border bg-background"
                }`}
        >
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-secondary">
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                    <path d="M42 23.0001C42.0069 25.6398 41.3901 28.2438 40.2 30.6001C37.3219 36.3587 31.4378 39.9976 25 40.0001C22.3603 40.0069 19.7562 39.3902 17.4 38.2001L6 42.0001L9.8 30.6001C8.60986 28.2438 7.99312 25.6398 8 23.0001C8.00249 16.5622 11.6413 10.6781 17.4 7.80006C19.7562 6.60992 22.3603 5.99317 25 6.00006H26" stroke="var(--tertiary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M32 6H42V16" stroke="var(--tertiary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M26 22L42 6" stroke="var(--tertiary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <p className="text-foreground">Drag & Drop your PowerPoint file here</p>
            <p className="text-muted-foreground text-sm">or</p>
            <Input
                ref={inputRef}
                type="file"
                accept=".pptx"
                className="hidden"
                onChange={handleChange}
            />
            <Button
                type="button"
                className="bg-tertiary text-white hover:bg-tertiary-foreground cursor-pointer"
                onClick={() => inputRef.current?.click()}
            >
                Browse Files
            </Button>
            {selectedFile ? (
                <div className="rounded-md border border-border bg-muted px-4 py-3 text-sm text-foreground">
                    Selected file: <strong>{selectedFile.name}</strong>
                </div>
            ) : null}
        </div>
    )
}