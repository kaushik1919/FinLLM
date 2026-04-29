import { cn } from '@/lib/utils'

interface LoadingDotsProps {
  className?: string
  size?: 'sm' | 'md'
}

export function LoadingDots({ className, size = 'md' }: LoadingDotsProps) {
  const dotSize = size === 'sm' ? 'h-1 w-1' : 'h-1.5 w-1.5'
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn('rounded-full bg-current animate-pulse-dot', dotSize)}
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
    </span>
  )
}
