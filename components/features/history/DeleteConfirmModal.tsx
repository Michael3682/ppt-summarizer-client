import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DeleteConfirmModalProps {
  isOpen: boolean
  fileName: string
  onConfirm: () => void
  onCancel: () => void
  isDeleting?: boolean
}

export function DeleteConfirmModal({
  isOpen,
  fileName,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-fit rounded-[2rem] bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-900">
            [ DELETE RECORD ]
          </p>
          <p className="text-sm text-slate-700">
            Are you sure you want to permanently delete <span className="font-semibold text-slate-900">'{fileName}'</span>?
          </p>
          <div className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            This action cannot be undone and will remove all summary results associated with this file.
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            className="flex-grow bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? "Deleting..." : "[ DELETE PERMANENTLY ]"}
          </Button>
          <Button
            className="flex-grow-2 border-tertiary bg-transparent text-primary hover:bg-tertiary hover:text-white cursor-pointer"
            disabled={isDeleting}
            onClick={onCancel}
          >
            [ CANCEL ]
          </Button>
        </div>
      </div>
    </div>
  )
}
