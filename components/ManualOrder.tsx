"use client";
import { useState, useRef } from "react";
import rates from "@/lib/order-rates.json";
import { requestOrders } from "@/lib/orders";

const fleet = [...new Set(rates.map((r) => String(r[0])))];
export default function ManualOrder({
  password,
  onCreated,
}: {
  password: string;
  onCreated: (code: string) => Promise<void>;
}) {
  const [printer, setPrinter] = useState(fleet[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef("");
  const materials = rates
    .filter((r) => r[0] === printer)
    .map((r) => String(r[1]));
  return (
    <form
      id="manual-add"
      className="space-y-4 rounded-xl border border-white/15 p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form)) as Record<
          string,
          string
        >;
        requestId.current ||= crypto.randomUUID();
        setBusy(true);
        setError("");
        try {
          const { code } = await requestOrders<{ code: string }>({
            ...data,
            action: "create",
            password,
            requestId: requestId.current,
          });
          requestId.current = "";
          form.reset();
          setPrinter(fleet[0]);
          await onCreated(code);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2 className="text-2xl font-bold">Add an order</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          Submitted by
          <input required name="member" />
        </label>
        <label>
          Submission email
          <input type="email" required name="email" />
        </label>
        <label>
          Capstone number (optional)
          <input name="team" />
        </label>
        <label>
          Machine
          <select
            name="printer"
            value={printer}
            onChange={(e) => setPrinter(e.target.value)}
          >
            {fleet.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <label>
          Rate tier
          <select name="tier">
            <option value="internal">Internal NAU</option>
            <option value="external">External</option>
          </select>
        </label>
        <label>
          Material
          <select name="material" key={printer}>
            {materials.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Submitted Google Drive files (one link per line)
        <textarea name="files" />
      </label>
      <button disabled={busy}>
        {busy ? "Adding…" : "Add order and email code"}
      </button>
      <p role="status">{error}</p>
    </form>
  );
}
