"use client";
import { useState } from "react";
import OrderLayout from "@/components/OrderLayout";
import { Order, requestOrders } from "@/lib/orders";

export default function OrdersPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <OrderLayout title="Track an order">
      <p>Enter the tracking code from your IDEA Lab confirmation email.</p>
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const email = String(
            new FormData(e.currentTarget).get("email"),
          ).trim();
          const code = String(new FormData(e.currentTarget).get("code"))
            .trim()
            .toUpperCase();
          setBusy(true);
          setOrder(null);
          setMessage("");
          try {
            setOrder(
              (
                await requestOrders<{ order: Order }>({
                  action: "lookup",
                  code,
                  email,
                })
              ).order,
            );
          } catch (err) {
            setMessage((err as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          Tracking code
          <input
            className="mt-2 font-mono"
            name="code"
            required
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="IDEA-…"
          />
        </label>
        <label>
          Submission email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <button disabled={busy}>{busy ? "Checking…" : "Check status"}</button>
      </form>
      <div aria-live="polite">
        {message}
        {order && (
          <section className="border-t border-white/15 pt-6 space-y-2">
            <h2 className="text-2xl font-semibold">{order.status}</h2>
            <p>{order.printer}</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2">
              <dt>Capstone number</dt>
              <dd>{order.team || "Not recorded"}</dd>
              <dt>Submitted by</dt>
              <dd>{order.member || "Not recorded"}</dd>
              <dt>Print cost</dt>
              <dd>
                {typeof order.cost === "number"
                  ? "$" + order.cost.toFixed(2)
                  : "Awaiting pricing"}
              </dd>
            </dl>
            <h3 className="font-semibold pt-3">Submitted files</h3>
            {order.files?.length ? (
              order.files.map((url, i) => (
                <p key={url}>
                  <a
                    className="text-blue-400 underline"
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open submitted file {i + 1} in Drive
                  </a>
                </p>
              ))
            ) : (
              <p>No files recorded.</p>
            )}
            <p>
              Submitted {new Date(order.submittedDate).toLocaleDateString()}
            </p>
            {order.labNotes && (
              <p className="whitespace-pre-wrap break-words">
                Lab note · {order.labNotes}
              </p>
            )}
          </section>
        )}
      </div>
    </OrderLayout>
  );
}
