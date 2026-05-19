'use client'

import { useActionState } from 'react';
import Link from 'next/link';
import { signUp, type AuthState } from '@/app/actions/auth';

const inputClassName =
  'w-full p-3 border rounded-xl dark:bg-gray-950 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500';

export default function SignUpForm() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(signUp, {});

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 p-3 rounded-xl">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="displayName" className="block text-sm font-medium mb-1.5">
          Display name
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          autoComplete="name"
          placeholder="How should we call you?"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1.5">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="At least 6 characters"
          className={inputClassName}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
