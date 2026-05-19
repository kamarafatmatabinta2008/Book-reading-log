import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import SignUpForm from "@/components/SignUpForm";

export const metadata = {
  title: "Sign up | READ_MATRIX",
};

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join the collective and sync your reading across devices."
      footer={
        <>
          <Link href="/" className="text-blue-600 hover:underline font-medium">
            ← Back to home
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthShell>
  );
}
