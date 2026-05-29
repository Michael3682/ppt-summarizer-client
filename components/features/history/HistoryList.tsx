"use client"

import Link from "next/link"
import { Eye, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useMemo, useState } from "react"
import type { Presentation } from "@/constants/presentation.types"
import { presentationService } from "@/services/presentation.service"
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

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const list = await presentationService.getAll()
        if (mounted) setPresentations(list)
      } catch (err: any) {
        console.error(err)
        setError(err?.response?.data?.message ?? err?.message ?? "Failed to load history")
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    fetchData()
    return () => { mounted = false }
  }, [])

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
        <div className="px-50 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">History</h1>
              <p className="text-sm text-muted-foreground">All your uploaded presentations and generated summaries</p>
            </div>
            <div className="w-80">
              <Input placeholder="Search by file name" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Presentations</CardTitle>
              <CardDescription>Recent uploads and generated summaries</CardDescription>
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
                    <Button>Upload Presentation</Button>
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
                              <div>
                                <div className="font-medium">{p.fileName}</div>
                                <div className="text-xs text-muted-foreground">{p.status}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">{formatDate(p.createdAt)}</td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <Link href={`/results/${p.id}`}>
                                <Button className="bg-tertiary text-white hover:bg-tertiary-foreground cursor-pointer" size="sm"><Eye /> View</Button>
                              </Link>
                              <Button className="bg-transparent text-primary border border-tertiary hover:bg-tertiary hover:text-white cursor-pointer" size="sm" onClick={() => handleDownload(p.id)}><Download /></Button>
                            </div>
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
                <div className="text-sm text-muted-foreground">Showing {Math.min(total, (page - 1) * pageSize + 1)}–{Math.min(total, page * pageSize)} of {total} entries</div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
                  <div className="px-3">Page {page} / {pages}</div>
                  <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>Next</Button>
                </div>
              </div>
            </CardFooter>
          </Card>

          <Link href="/" className="fixed bottom-6 right-6">
            <Button size="icon" aria-label="Upload new presentation">+</Button>
          </Link>
        </div>
      </main>
  )
}
