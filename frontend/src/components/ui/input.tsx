import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="label-xs text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-8 w-full rounded border border-border bg-bg-surface px-3 text-sm text-text-primary placeholder:text-text-muted',
            'transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-danger focus:border-danger focus:ring-danger/30',
            className,
          )}
          {...props}
        />
        {error && <p className="text-2xs text-danger">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
