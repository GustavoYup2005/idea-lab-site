"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { requestOrders } from "@/lib/orders";

export default function TestSubmission({ cost, printer }: { cost: number; printer: string }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const id = useRef("");
  if (code) return <section className="space-y-2"><h2 className="font-bold">Test order created</h2><p>Track <strong>{code}</strong> with the email you entered.</p><Link className="underline" href="/orders">Track this order</Link> · <Link className="underline" href="/lab-admin">Open staff queue</Link></section>;
  return <form className="space-y-3" onSubmit={async e => {
    e.preventDefault();
    const fields = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    id.current ||= crypto.randomUUID();
    try {
      const result = await requestOrders<{code:string}>({ action:"student", requestId:id.current, printer, cost:cost.toFixed(2), member:"Test student", email:String(fields.get("email")) });
      setCode(result.code);
    } catch (err) { setError((err as Error).message); } finally { setBusy(false); }
  }}>
    <h2 className="font-bold">Try a student submission</h2>
    <label className="block">Test email<input name="email" type="email" required defaultValue="student@example.test" className="block w-full border rounded-xl p-2 mt-1"/></label>
    <button disabled={busy} className="rounded-full bg-black text-white px-5 py-3">{busy ? "Creating…" : "Create test order"}</button>
    <p role="status" className="text-sm">{error || "Saves to the local queue. Email and printer delivery are off."}</p>
  </form>;
}
