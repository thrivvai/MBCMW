import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0B0C0F] flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-8 w-full">
        <div className="text-center">
          {/* Abstract diamond mark — matches join page */}
          <div className="w-12 h-12 border border-[#C9A84C]/25 bg-[#C9A84C]/05 flex items-center justify-center mx-auto mb-6">
            <div className="w-6 h-6 border border-[#EDE8DC]/35 rotate-45" />
          </div>
          <h1 className="font-display text-2xl text-[#EDE8DC] font-[600] tracking-tight">
            Teacher Portal
          </h1>
          <p className="text-[#666360] text-sm mt-1.5 font-light">
            MathWorld Classroom
          </p>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
