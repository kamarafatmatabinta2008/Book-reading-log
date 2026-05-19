'use client'

import { useActionState } from 'react';
import Link from 'next/link';
import { signIn, type AuthState } from '@/app/actions/auth';

const inputClassName =
  'w-full p-3 border rounded-xl dark:bg-gray-950 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500';

type LoginFormProps = {
  registered?: boolean;
};

export default function LoginForm({ registered }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(signIn, {});

  return (
    <form action={formAction} className="space-y-5">
      {registered && (
        <p className="text-sm text-green-700 bg-green-50 dark:bg-green-950/40 dark:text-green-400 p-3 rounded-xl">
          Account created. Sign in with your email and password.
        </p>
      )}

      {state.error && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 p-3 rounded-xl">
          {state.error}
        </p>
      )}

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
          autoComplete="current-password"
          placeholder="Your password"
          className={inputClassName}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-semibold text-blue-600 hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
