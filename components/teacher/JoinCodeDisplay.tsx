"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  code: string;
  appUrl: string;
}

export function JoinCodeDisplay({ code, appUrl }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(`${appUrl}/join?code=${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
      <div className="flex-1 text-center sm:text-left">
        <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">
          Classroom Join Code
        </p>
        <p className="text-5xl font-black text-white tracking-[0.3em]">{code}</p>
        <p className="text-sm text-gray-400 mt-1">
          Students go to <span className="text-indigo-300">{appUrl}/join</span>
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={copy}>
          {copied ? "✓ Copied!" : "Copy Link"}
        </Button>
      </div>
    </div>
  );
}
