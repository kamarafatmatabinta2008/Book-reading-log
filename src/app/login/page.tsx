import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Sign in | READ_MATRIX",
};

type LoginPageProps = {
  searchParams: Promise<{ registered?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const registered = params.registered === "1";

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to access your library and reading progress."
      footer={
        <Link href="/" className="text-blue-600 hover:underline font-medium">
          ← Back to home
        </Link>
      }
    >
      <LoginForm registered={registered} />
    </AuthShell>
  );
}
