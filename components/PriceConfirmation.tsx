"use client";
import { useState } from "react";
import { requestOrders } from "@/lib/orders";
import { useLabTest } from "@/lib/lab-test";

type Draft = {to:string; subject:string; body:string; signature:string; sent:boolean};
export default function PriceConfirmation({code,password}:{code:string;password:string}) {
  const demo = useLabTest();
  const [draft,setDraft] = useState<Draft|null>(null);
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState("");
  async function act(send:boolean) {
    setBusy(true);
    setMessage("");
    try {
      if (send && draft) {
        await requestOrders({action:"sendPrice",code,password,signature:draft.signature});
        setDraft({...draft,sent:true});
        setMessage(demo ? "Saved to the local test outbox." : "Price confirmation sent.");
      } else {
        setDraft(null);
        setDraft(await requestOrders<Draft>({action:"previewPrice",code,password}));
      }
    } catch (err) {setMessage((err as Error).message);}
    finally {setBusy(false);}
  }
  return <section className="space-y-3 border-t border-zinc-200 pt-3">
    <button type="button" disabled={busy} onClick={() => void act(false)}>Preview price email</button>
    {draft && <div className="space-y-2"><p>To · {draft.to}</p><strong>{draft.subject}</strong>
      <p className="whitespace-pre-line break-words">{draft.body}</p>
      {draft.sent ? <p>{demo ? "Recorded in test outbox" : "Confirmation already sent"}</p> :
        <button type="button" disabled={busy} onClick={() => void act(true)}>{demo ? "Send to test outbox" : "Send price confirmation"}</button>}
    </div>}
    <p role="status">{message}</p>
  </section>;
}
