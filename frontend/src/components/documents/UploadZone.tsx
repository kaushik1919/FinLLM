'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, CheckCircle2, AlertCircle } from 'lucide-react'
import { useUploadDocument } from '@/hooks/use-documents'
import { formatBytes, generateId } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { UploadingFile } from '@/lib/types'

const ACCEPTED = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
}

export function UploadZone() {
  const upload = useUploadDocument()
  const [queue, setQueue] = useState<UploadingFile[]>([])

  const onDrop = useCallback(
    async (files: File[]) => {
      for (const file of files) {
        const id = generateId()
        setQueue((q) => [
          ...q,
          { id, filename: file.name, size: file.size, status: 'uploading' },
        ])
        upload.mutate(file, {
          onSuccess: () =>
            setQueue((q) =>
              q.map((f) => (f.id === id ? { ...f, status: 'success' } : f)),
            ),
          onError: (err) =>
            setQueue((q) =>
              q.map((f) =>
                f.id === id
                  ? { ...f, status: 'error', error: (err as Error).message }
                  : f,
              ),
            ),
        })
      }
    },
    [upload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: 50 * 1024 * 1024,
  })

  function removeFromQueue(id: string) {
    setQueue((q) => q.filter((f) => f.id !== id))
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        {...getRootProps()}
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors',
          isDragActive
            ? 'border-accent bg-accent/5 text-accent'
            : 'border-border hover:border-border-strong text-text-muted hover:text-text-secondary',
        )}
      >
        <input {...getInputProps()} />
        <Upload size={24} />
        <div className="text-center">
          <p className="text-sm font-medium">
            {isDragActive ? 'Drop files here' : 'Drop files or click to upload'}
          </p>
          <p className="text-xs text-text-muted mt-0.5">PDF, DOCX, TXT · max 50 MB</p>
        </div>
      </div>

      {queue.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {queue.map((f) => (
            <div key={f.id} className="panel flex items-center gap-2.5 px-3 py-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-primary truncate">{f.filename}</p>
                <p className="text-2xs text-text-muted">{formatBytes(f.size)}</p>
              </div>
              {f.status === 'uploading' && (
                <span className="h-3 w-3 rounded-full border-2 border-accent border-t-transparent animate-spin" />
              )}
              {f.status === 'success' && <CheckCircle2 size={14} className="text-success shrink-0" />}
              {f.status === 'error' && <AlertCircle size={14} className="text-danger shrink-0" />}
              {f.status !== 'uploading' && (
                <button
                  onClick={() => removeFromQueue(f.id)}
                  className="text-text-muted hover:text-text-primary"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
