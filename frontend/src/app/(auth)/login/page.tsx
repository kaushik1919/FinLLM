'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useLogin, isApiError } from '@/hooks/use-auth'
import type { LoginPayload } from '@/lib/types'

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>()
  const login = useLogin()
  const [serverError, setServerError] = useState<string | null>(null)

  async function onSubmit(data: LoginPayload) {
    setServerError(null)
    login.mutate(data, {
      onError: (err) => {
        setServerError(isApiError(err) ? err.message : 'Login failed')
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
          <h2 className="mb-5 text-sm font-medium text-text-primary">Sign in</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              error={errors.username?.message}
              {...register('username', { required: 'Email is required' })}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', { required: 'Password is required' })}
            />

            {serverError && (
              <p className="text-xs text-danger">{serverError}</p>
            )}

            <Button
              type="submit"
              className="mt-1 w-full"
              loading={login.isPending}
            >
              Sign in
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-text-muted">
            No account?{' '}
            <Link href="/register" className="text-accent hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
