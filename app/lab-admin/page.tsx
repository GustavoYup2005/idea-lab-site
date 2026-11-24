"use client";
import { useState } from "react";
import OrderLayout from "@/components/OrderLayout";
import PriceConfirmation from "@/components/PriceConfirmation";
import PrinterWorksheet from "@/components/PrinterWorksheet";
import rates from "@/lib/order-rates.json";
import ManualOrder from "@/components/ManualOrder";
import { StaffOrder, requestOrders, statuses } from "@/lib/orders";

export default function StaffPage() {
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<StaffOrder[] | null>(null);
  const [printer, setPrinter] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function refresh() {
    setBusy(true);
    setMessage("");
    try {
      setOrders(
        (
          await requestOrders<{ orders: StaffOrder[] }>({
            action: "list",
            password,
          })
        ).orders,
      );
    } catch (err) {
      setOrders(null);
      setMessage((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <OrderLayout title="Staff order queue">
      {orders === null ? (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void refresh();
          }}
        >
          <label>
            Staff password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        </form>
      ) : (
        <>
          <div className="flex gap-3 items-center flex-wrap">
            <span>{orders.length} {orders.length === 1 ? "order" : "orders"}</span>
            <button disabled={busy} onClick={refresh}>
              Refresh
            </button>
            <button
              disabled={busy}
              onClick={() => {
                setOrders(null);
                setPassword("");
                setMessage("");
              }}
            >
              Sign out
            </button>
          </div>
          <label>Printer<select value={printer} onChange={e => setPrinter(e.target.value)}>
            <option value="">All tracked orders</option>
            {[...new Set(rates.map(r => String(r[0])))].sort().map(name => <option key={name}>{name}</option>)}
          </select></label>
          {printer && <PrinterWorksheet key={printer} printer={printer} password={password} onSaved={refresh} />}
          <details className="rounded-xl border border-zinc-200 p-4"><summary className="cursor-pointer font-semibold">Add an order manually</summary>
          <ManualOrder
            password={password}
            onCreated={async (code) => {
              await refresh();
              setMessage("Created " + code + ".");
            }}
          />
          </details>
          {!orders.length && <p>The queue is empty.</p>}
          {orders.filter(order => !printer || order.printer === printer).map((order) => (
            <form
              key={JSON.stringify(order)}
              className="border-t border-white/15 py-5 space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                const values = new FormData(e.currentTarget);
                const status = String(values.get("status")),
                  note = String(values.get("note"));
                setBusy(true);
                setMessage("");
                try {
                  await requestOrders({
                    action: "update",
                    password,
                    code: order.code,
                    status,
                    note,
                    previousStatus: order.status,
                    previousNote: order.labNotes,
                  });
                  setOrders((rows) =>
                    rows!.map((r) =>
                      r.code === order.code
                        ? { ...r, status, labNotes: note }
                        : r,
                    ),
                  );
                  setMessage("Saved " + order.code + ".");
                } catch (err) {
                  setMessage((err as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <h2 className="text-xl font-semibold">{order.printer}</h2>
              <p className="break-words">
                {order.email} ·{" "}
                {new Date(order.submittedDate).toLocaleDateString()}
              </p>
              <p className="font-mono">{order.code}</p>
              <p>{typeof order.cost === "number" ? "Print cost · $" + order.cost.toFixed(2) : "Awaiting pricing"}</p>
              {order.files?.map((url, index) => <a className="block underline" key={url} href={url} target="_blank" rel="noreferrer">Open submitted file {index + 1}</a>)}
              <label>
                Status
                <select name="status" defaultValue={order.status}>
                  {!statuses.some(s => s === order.status) && <option>{order.status}</option>}
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label>
                Note visible to student
                <textarea
                  name="note"
                  maxLength={500}
                  defaultValue={order.labNotes}
                />
              </label>
              <button disabled={busy}>Save changes</button>
              <PriceConfirmation code={order.code} password={password} />
            </form>
          ))}
        </>
      )}
      <p role="status">{message}</p>
    </OrderLayout>
  );
}
