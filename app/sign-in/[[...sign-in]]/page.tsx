import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-space-bg flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <p className="text-4xl mb-3">🏙️</p>
          <h1 className="text-2xl font-black text-white">MathWorld Classroom</h1>
          <p className="text-gray-400 text-sm mt-1">Teacher & Admin Portal</p>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
