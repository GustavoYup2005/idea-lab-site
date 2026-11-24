import Link from "next/link";
import type { ReactNode } from "react";
import { useLabTest } from "@/lib/lab-test";

export default function OrderLayout({ title, children }: { title: string; children: ReactNode }) {
  const demo = useLabTest();
  return (
    <main className="lab-shell">
      <nav className="lab-nav" aria-label="Lab services">
        <Link className="lab-wordmark" href="/">IDEA Lab</Link>
        <div><Link href="/order">Calculator</Link><Link href="/orders">Track</Link><Link href="/submit">Submit</Link></div>
      </nav>
      <div className="lab-workspace">
        <header><p>Northern Arizona University</p><h1>{title}</h1></header>
        {demo && <aside className="lab-test-note">Local test queue · Orders clear when the preview restarts.</aside>}
        <div className="lab-panel space-y-5">{children}</div>
      </div>
    </main>
  );
}
