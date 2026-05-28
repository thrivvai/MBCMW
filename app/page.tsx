import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-city-bg flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
            🏙️ MathWorld Classroom MVP
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-white leading-tight tracking-tight">
            Math that feels{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              real.
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-xl mx-auto leading-relaxed">
            Browser-based financial math missions for grades 4–12. Students explore
            MathWorld City, solve real money challenges, and earn badges — no apps
            required.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/join">
              <Button size="lg" className="w-full sm:w-auto">
                Join a Classroom Session →
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Teacher Login
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Grade bands */}
      <div className="border-t border-city-border px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs text-gray-500 uppercase tracking-widest mb-10">
            Grade Bands Supported
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { band: "Grades 4–5", label: "Foundations", desc: "Budgeting, price comparison, basic arithmetic", color: "indigo" },
              { band: "Grades 6–8", label: "Applied Math", desc: "Percentages, interest, profit & loss, taxes", color: "amber" },
              { band: "Grades 9–12", label: "Financial Strategy", desc: "Credit, investing, income, compound growth", color: "purple" },
            ].map(({ band, label, desc, color }) => (
              <div key={band} className={`bg-city-card border border-city-border rounded-2xl p-6 hover:border-${color}-500/50 transition-colors`}>
                <p className={`text-xs font-bold text-${color}-400 uppercase tracking-wider mb-1`}>{band}</p>
                <p className="text-white font-bold text-lg mb-2">{label}</p>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
