'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRegister, isApiError } from '@/hooks/use-auth'
import type { RegisterPayload } from '@/lib/types'

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPayload>()
  const registerMutation = useRegister()
  const [serverError, setServerError] = useState<string | null>(null)

  async function onSubmit(data: RegisterPayload) {
    setServerError(null)
    registerMutation.mutate(data, {
      onError: (err) => {
        setServerError(isApiError(err) ? err.message : 'Registration failed')
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-text-primary">
            Fin<span className="text-accent">LLM</span>
          </h1>
          <p className="mt-1 text-xs text-text-muted">Financial intelligence assistant</p>
        </div>

        <div className="panel p-6">
          <h2 className="mb-5 text-sm font-medium text-text-primary">Create account</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
              })}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Min 8 characters' },
              })}
            />

            {serverError && (
              <p className="text-xs text-danger">{serverError}</p>
            )}

            <Button
              type="submit"
              className="mt-1 w-full"
              loading={registerMutation.isPending}
            >
              Create account
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-text-muted">
            Already have an account?{' '}
            <Link href="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
