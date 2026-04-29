import { cn } from '@/lib/utils'
import type { MessageSource } from '@/lib/types'

interface CitationChipProps {
  index: number
  source: MessageSource
  className?: string
}

export function CitationChip({ index, source, className }: CitationChipProps) {
  return (
    <span
      className={cn('citation-inline', className)}
      title={source.filename ?? undefined}
    >
      {index + 1}
    </span>
  )
}
