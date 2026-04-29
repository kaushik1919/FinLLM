'use client'

import { X, FileText, ExternalLink } from 'lucide-react'
import { useUiStore, selectSourcePanelOpen } from '@/stores/ui-store'
import { useChatStore } from '@/stores/chat-store'
import { cn } from '@/lib/utils'

export function SourcePanel() {
  const isOpen = useUiStore(selectSourcePanelOpen)
  const closePanel = useUiStore((s) => s.closePanel)
  const sources = useChatStore((s) => s.currentSources)

  return (
    <aside
      className={cn(
        'fixed right-0 top-0 h-full w-source-panel border-l border-border bg-bg-surface flex flex-col',
        'transition-transform duration-200 ease-out z-20',
        isOpen ? 'translate-x-0' : 'translate-x-full',
      )}
    >
      <div className="flex h-topbar items-center justify-between border-b border-border px-4">
        <span className="text-xs font-medium text-text-primary">Sources</span>
        <button
          onClick={() => closePanel()}
          className="p-1 text-text-muted hover:text-text-primary transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {sources.length === 0 ? (
          <p className="text-xs text-text-muted py-8 text-center">No sources for this message</p>
        ) : (
          sources.map((src, i) => (
            <div
              key={i}
              className="panel p-3 flex flex-col gap-1.5 hover:border-border-strong transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="citation-inline">{i + 1}</span>
                <FileText size={12} className="text-text-muted shrink-0" />
                <span className="text-xs text-text-primary truncate flex-1">
                  {src.filename ?? 'Unknown file'}
                </span>
              </div>
              {src.chunk_index !== null && (
                <p className="text-2xs text-text-muted">Chunk {src.chunk_index}</p>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  )
}
