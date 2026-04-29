import { DocumentCard } from './DocumentCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { FileText } from 'lucide-react'
import type { Document } from '@/lib/types'

interface DocumentListProps {
  documents: Document[]
}

export function DocumentList({ documents }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <EmptyState
        icon={<FileText size={20} />}
        title="No documents yet"
        description="Upload PDF, DOCX, or TXT files to start analysing them."
      />
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} document={doc} />
      ))}
    </div>
  )
}
