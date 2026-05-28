import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-city-bg">
      <header className="bg-city-bg/80 backdrop-blur-sm border-b border-city-border sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/teacher/dashboard" className="flex items-center gap-2 text-white font-bold">
            <span className="text-xl">🏙️</span>
            <span>MathWorld</span>
            <span className="text-xs text-indigo-400 font-normal border border-indigo-500/30 px-2 py-0.5 rounded-full ml-1">
              Teacher
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/teacher/sessions/new" className="text-sm text-gray-400 hover:text-white transition-colors">
              + New Session
            </Link>
            <UserButton afterSignOutUrl="/" />
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
