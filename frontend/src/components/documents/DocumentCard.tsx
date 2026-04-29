'use client'

import { Trash2, FileText, RefreshCw } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { useDeleteDocument } from '@/hooks/use-documents'
import { formatBytes, formatDate } from '@/lib/utils'
import type { Document } from '@/lib/types'

interface DocumentCardProps {
  document: Document
}

export function DocumentCard({ document: doc }: DocumentCardProps) {
  const deleteDoc = useDeleteDocument()

  return (
    <div className="panel flex items-start gap-3 p-3 hover:border-border-strong transition-colors group">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-elevated text-text-muted">
        <FileText size={16} />
      </div>

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-text-primary truncate flex-1">{doc.filename}</p>
          <StatusBadge status={doc.status} />
        </div>
        <div className="flex items-center gap-3 text-2xs text-text-muted">
          <span>{formatBytes(doc.file_size)}</span>
          {doc.chunk_count > 0 && <span>{doc.chunk_count} chunks</span>}
          <span>{formatDate(doc.created_at)}</span>
        </div>
        {doc.error_message && (
          <p className="text-2xs text-danger mt-0.5">{doc.error_message}</p>
        )}
      </div>

      <Button
        variant="ghost"
        size="xs"
        className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger"
        onClick={() => deleteDoc.mutate(doc.id)}
        loading={deleteDoc.isPending}
        title="Delete"
      >
        <Trash2 size={12} />
      </Button>
    </div>
  )
}
