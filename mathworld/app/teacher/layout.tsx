import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-[100dvh] bg-[#0B0C0F]">
      <header
        className="sticky top-0 z-20 border-b border-white/8"
        style={{ background: "rgba(11,12,15,0.90)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/teacher/dashboard" className="flex items-center gap-3 cursor-pointer group">
            {/* Diamond mark */}
            <div className="w-8 h-8 border border-[#C9A84C]/25 bg-[#C9A84C]/05 flex items-center justify-center transition-colors duration-200 group-hover:border-[#C9A84C]/40">
              <div className="w-4 h-4 border border-[#EDE8DC]/35 rotate-45" />
            </div>
            <span className="font-display text-[#EDE8DC] text-lg font-[600] tracking-tight">MathWorld</span>
            <span className="text-[10px] text-[#C9A84C] font-sans border border-[#C9A84C]/25 px-2 py-0.5 rounded-sm tracking-widest uppercase">
              Teacher
            </span>
          </Link>
          <nav className="flex items-center gap-5">
            <Link
              href="/teacher/sessions/new"
              className="text-sm text-[#9A9694] hover:text-[#EDE8DC] transition-colors duration-200 cursor-pointer"
            >
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
