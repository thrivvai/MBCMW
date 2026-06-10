"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStudentStore } from "@/stores/student-store";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { isJoined } = useStudentStore();
  const router = useRouter();

  useEffect(() => {
    if (!isJoined) {
      router.replace("/join");
    }
  }, [isJoined, router]);

  if (!isJoined) return null;

  return <>{children}</>;
}
