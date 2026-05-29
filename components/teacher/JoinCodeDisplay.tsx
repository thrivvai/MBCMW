"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  code: string;
  appUrl: string;
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 4V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function JoinCodeDisplay({ code, appUrl }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(`${appUrl}/join?code=${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-sm p-6 flex flex-col sm:flex-row items-center gap-5"
      style={{
        background: "rgba(201,168,76,0.05)",
        border: "1px solid rgba(201,168,76,0.20)",
      }}
    >
      <div className="flex-1 text-center sm:text-left">
        <p className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-[0.2em] mb-2">
          Classroom Join Code
        </p>
        <p className="font-sans text-5xl font-bold text-[#EDE8DC] tracking-[0.3em] tabular-nums mb-1.5">
          {code}
        </p>
        <p className="text-sm text-[#666360] font-light">
          Students go to{" "}
          <span className="text-[#C9A84C]/80">{appUrl}/join</span>
        </p>
      </div>
      <div>
        <Button variant="secondary" size="sm" onClick={copy}>
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied!" : "Copy Link"}
        </Button>
      </div>
    </div>
  );
}
