'use client'

import { TopBar } from '@/components/layout/TopBar'
import { UploadZone } from '@/components/documents/UploadZone'
import { DocumentList } from '@/components/documents/DocumentList'
import { useDocuments } from '@/hooks/use-documents'

export default function DocumentsPage() {
  const { data: documents, isLoading } = useDocuments()

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Documents" />
      <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full">
        <div className="flex flex-col gap-6">
          <section>
            <h2 className="label-xs text-text-muted uppercase tracking-wider mb-3">Upload</h2>
            <UploadZone />
          </section>

          <section>
            <h2 className="label-xs text-text-muted uppercase tracking-wider mb-3">
              Library
              {documents && (
                <span className="ml-1.5 text-text-muted normal-case">({documents.length})</span>
              )}
            </h2>
            {isLoading ? (
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-lg bg-bg-elevated animate-pulse" />
                ))}
              </div>
            ) : (
              <DocumentList documents={documents ?? []} />
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
