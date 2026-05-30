"use client"

import Link from "next/link"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useEffect, useMemo, useState } from "react"
import type { Presentation } from "@/constants/presentation.types"
import { presentationService } from "@/services/presentation.service"
import { Eye, Download, Trash2, EllipsisVertical } from "lucide-react"
import { DeleteConfirmModal } from "@/components/features/history/DeleteConfirmModal"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

function formatDate(iso?: string) {
  if (!iso) return "-"
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

function getLength(summary?: string | null) {
  if (!summary) return "-"
  const words = summary.trim().split(/\s+/).filter(Boolean).length
  return `${words} words`
}

export default function HistoryList() {
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPresentation, setSelectedPresentation] = useState<Presentation | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [menuState, setMenuState] = useState<{ id: string; top: number; right: number } | null>(null)

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 10

  const isMobile = useIsMobile()

  const fetchPresentations = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const list = await presentationService.getAll()
      setPresentations(list)
    } catch (err: any) {
      console.error(err)
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to load history")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPresentations()
  }, [])

  useEffect(() => {
    if (!menuState) return
    const close = () => setMenuState(null)
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [menuState])

  const openDeleteModal = (presentation: Presentation) => {
    setSelectedPresentation(presentation)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedPresentation(null)
  }

  const handleConfirmDelete = async () => {
    if (!selectedPresentation) return

    setIsDeleting(true)
    try {
      await presentationService.deletePresentation(selectedPresentation.id)
      toast.success("Presentation deleted successfully")
      await fetchPresentations()
      closeDeleteModal()
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.message ?? err?.message ?? "Failed to delete presentation")
    } finally {
      setIsDeleting(false)
    }
  }

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    if (!s) return presentations
    return presentations.filter((p) => p.fileName.toLowerCase().includes(s))
  }, [presentations, search])

  const total = filtered.length
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    if (page > pages) setPage(1)
  }, [pages])

  const handleDownload = async (id: string) => {
    try {
      const blob = await presentationService.downloadPresentation(id, "pdf")
      const url = window.URL.createObjectURL(blob as Blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "summary.pdf"
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert("Failed to download file")
    }
  }

  return (
    <main className="flex-grow">
      <div className="p-4 sm:px-50 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold">History</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">All your uploaded presentations and generated summaries</p>
          </div>
          <div className="w-80">
            <Input className="text-xs" placeholder="Search by file name" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          </div>
        </div>

        <Card className="rounded-xl z-10">
          <CardHeader>
            <CardTitle>Presentations</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Recent uploads and generated summaries
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : error ? (
              <div className="text-destructive py-8">{error}</div>
            ) : total === 0 ? (
              <div className="py-12 text-center">
                <p className="text-lg font-medium">No history yet</p>
                <p className="text-sm text-muted-foreground mb-4">Upload a presentation to generate a summary.</p>
                <Link href="/">
                  <Button className="bg-tertiary text-white hover:bg-tertiary-foreground cursor-pointer">Upload Presentation</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-sm text-muted-foreground border-b">
                      <th className="py-3">File Name</th>
                      <th className="py-3">Date Summarized</th>
                      <th className="py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((p) => (
                      <tr key={p.id} className="border-b hover:bg-muted">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="text-xs sm:text-base truncate font-medium max-w-[100px] sm:max-w-full">{p.fileName}</div>
                          </div>
                        </td>
                        <td className="text-xs sm:text-base py-3">{formatDate(p.createdAt)}</td>
                        <td className="py-3">
                          {isMobile ? (
                            <div className="flex justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (menuState?.id === p.id) {
                                    setMenuState(null)
                                  } else {
                                    const rect = e.currentTarget.getBoundingClientRect()
                                    setMenuState({
                                      id: p.id,
                                      top: rect.bottom + window.scrollY,
                                      right: window.innerWidth - rect.right,
                                    })
                                  }
                                }}
                                className="p-2 hover:opacity-70 transition-opacity"
                                aria-label="Menu"
                              >
                                <EllipsisVertical size={20} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Link href={`/results/${p.id}`}>
                                <Button className="w-full text-[10px] bg-tertiary text-white hover:bg-tertiary-foreground cursor-pointer">
                                  <Eye size={isMobile ? 16 : 20} /> View
                                </Button>
                              </Link>
                              <Button
                                className="bg-transparent text-primary border border-tertiary hover:bg-tertiary hover:text-white cursor-pointer"
                                size="sm"
                                onClick={() => handleDownload(p.id)}
                              >
                                <Download size={isMobile ? 16 : 20} />
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-700 border border-transparent cursor-pointer"
                                onClick={() => openDeleteModal(p)}
                                aria-label={`Delete ${p.fileName}`}
                              >
                                <Trash2 size={isMobile ? 16 : 20} />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="flex items-center justify-between w-full">
              <div className="text-xs sm:text-sm text-muted-foreground">
                Showing {Math.min(total, (page - 1) * pageSize + 1)}–{Math.min(total, page * pageSize)} of {total} entries
              </div>
              <div className="flex items-center sm:gap-2">
                <Button className="px-2" variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
                <div className="px-3">Page {page} / {pages}</div>
                <Button className="px-2" variant="ghost" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>Next</Button>
              </div>
            </div>
          </CardFooter>
        </Card>

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          fileName={selectedPresentation?.fileName ?? ""}
          onConfirm={handleConfirmDelete}
          onCancel={closeDeleteModal}
          isDeleting={isDeleting}
        />

        <Link href="/" className="fixed bottom-6 right-6">
          <Button size="icon" aria-label="Upload new presentation">+</Button>
        </Link>
      </div>

      {menuState && (
        <div
          className="fixed bg-background border border-ring rounded-md shadow-lg p-2 w-40 z-[9999]"
          style={{ top: menuState.top, right: menuState.right }}
          onClick={(e) => e.stopPropagation()}
        >
          {(() => {
            const p = pageItems.find((p) => p.id === menuState.id)
            if (!p) return null
            return (
              <>
                <Link href={`/results/${p.id}`} onClick={() => setMenuState(null)}>
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded flex items-center gap-2 transition-colors">
                    <Eye size={16} /> View
                  </button>
                </Link>
                <button
                  onClick={() => {
                    handleDownload(p.id)
                    setMenuState(null)
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded flex items-center gap-2 transition-colors"
                >
                  <Download size={16} /> Download
                </button>
                <button
                  onClick={() => {
                    openDeleteModal(p)
                    setMenuState(null)
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-red-100 text-red-600 rounded flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </>
            )
          })()}
        </div>
      )}
    </main>
  )
}