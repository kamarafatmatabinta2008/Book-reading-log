"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createAnonClient } from "@/lib/supabase/client";
import { signOut } from "@/app/actions/auth";

export default function NavAuthClient() {
  const [user, setUser] = useState<{ email?: string; user_metadata?: { display_name?: string } } | null>(null);

  useEffect(() => {
    const supabase = createAnonClient();

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    void loadUser();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-full px-4 py-2 text-sm font-semibold text-slate-900 transition-colors duration-200 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-gray-800"
      >
        Sign In
      </Link>
    );
  }

  const displayName = user.user_metadata?.display_name || user.email?.split("@")[0] || "Reader";

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-slate-500 dark:text-slate-400 sm:inline">
        Hi, <span className="font-semibold text-slate-900 dark:text-white">{displayName}</span>
      </span>
      <form action={signOut}>
        <button
          type="submit"
          className="rounded-full px-4 py-2 text-sm font-medium text-slate-900 transition-colors duration-200 hover:text-blue-600 dark:text-slate-100"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
