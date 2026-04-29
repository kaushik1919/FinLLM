import { Badge } from '@/components/ui/badge'
import type { DocumentStatus } from '@/lib/types'
import type { VariantProps } from 'class-variance-authority'

const STATUS_MAP: Record<DocumentStatus, { label: string; variant: 'default' | 'accent' | 'success' | 'warning' | 'danger' }> = {
  pending:    { label: 'Pending',    variant: 'default' },
  processing: { label: 'Processing', variant: 'accent' },
  ready:      { label: 'Ready',      variant: 'success' },
  failed:     { label: 'Failed',     variant: 'danger' },
}

interface StatusBadgeProps {
  status: DocumentStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, variant } = STATUS_MAP[status] ?? { label: status, variant: 'default' }
  return <Badge variant={variant} size="sm">{label}</Badge>
}
