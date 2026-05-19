import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";

export default async function NavAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const displayName =
      (user.user_metadata?.display_name as string | undefined) ||
      user.email?.split("@")[0] ||
      "Reader";

    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500 hidden sm:inline">
          Hi, <span className="font-semibold text-gray-900 dark:text-gray-100">{displayName}</span>
        </span>
        <form action={signOut}>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="px-4 py-2 text-sm font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full"
    >
      Sign In
    </Link>
  );
}
