"use client";
import { useEffect, useState } from "react";
import { requestOrders } from "@/lib/orders";
import rates from "@/lib/order-rates.json";

type Row = { row: number; cells: string[]; revision: string; editable: number[] };
type Grid = { sheetUrl?: string; headers: string[]; columns: number[]; rows: Row[]; page: number; total: number; schema: string };

export default function PrinterWorksheet({ printer, password, onSaved }: { printer: string; password: string; onSaved: () => Promise<void> }) {
  const [tabs, setTabs] = useState<string[]>([]);
  const [tab, setTab] = useState("");
  const [grid, setGrid] = useState<Grid | null>(null);
  const [page, setPage] = useState(0);
  const [reload, setReload] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [row, selectRow] = useState<Row | null>(null);
  const [column, selectColumn] = useState(0);
  useEffect(() => {
    let current = true;
    requestOrders<{tabs:string[]}>({action:"worksheets", printer, password}).then(result => {
      if (current) { setTabs(result.tabs); setTab(result.tabs[0] || ""); }
    }).catch(err => { if (current) setMessage(err.message); });
    return () => { current = false; };
  }, [printer,password]);
  useEffect(() => {
    if (!tab) return;
    let current = true;
    setLoading(true);
    setGrid(null);
    selectRow(null);
    requestOrders<Grid>({action:"worksheet", printer, password, tab, page:String(page)}).then(result => {
      if (current) setGrid(result);
    }).catch(err => { if (current) setMessage(err.message); }).finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [printer,password,tab,page,reload]);

  async function save(form: HTMLFormElement, existing?: Row) {
    if (!grid) return;
    const changes = Object.fromEntries(Array.from(new FormData(form)).filter(([key,v]) => /^\d+$/.test(key) && (existing || v !== "")));
    setSaving(true);
    try {
      await requestOrders({ action:"saveWorksheet", printer, password, tab, schema:grid.schema,
        row:existing ? String(existing.row) : "", revision:existing?.revision || "", changes:JSON.stringify(changes) });
      await onSaved();
      setMessage("Saved to the worksheet.");
      setReload(n => n+1);
    } catch (err) { setMessage((err as Error).message); }
    finally { setSaving(false); }
  }

  function field(i: number, value = "") {
    if (tab === "Team print pricing" && [2,3,7].includes(i)) {
      const options = i === 2 ? rates.filter(r => r[0] === printer).map(r => printer + " • " + r[1]) : i === 3 ? ["Internal","External"] : ["TRUE","FALSE"];
      return <select name={String(i)} defaultValue={value}><option value="">Choose</option>{options.map(o => <option key={o}>{o}</option>)}</select>;
    }
    return <input name={String(i)} defaultValue={value} />;
  }
  return <section className="space-y-4 rounded-2xl border border-zinc-200 p-4">
    <h2 className="text-xl font-semibold">Printer worksheets</h2>
    <label>Worksheet<select disabled={saving} value={tab} onChange={e => { setGrid(null); setTab(e.target.value); setPage(0); setMessage(""); }}>{tabs.map(t => <option key={t}>{t}</option>)}</select></label>
    <button type="button" disabled={saving || !tab || loading} onClick={() => { setMessage(""); setReload(n => n+1); }}>Refresh worksheet</button>
    {loading && <p role="status">Loading worksheet…</p>}
    {grid && <>
      {grid.sheetUrl && <a href={grid.sheetUrl} target="_blank" rel="noreferrer" className="underline">Open the live Google Sheet</a>}
      <details key={tab+reload}><summary className="cursor-pointer">Add worksheet row</summary>
        <form className="space-y-3 py-4" onSubmit={e => { e.preventDefault(); void save(e.currentTarget); }}>
          {grid.columns.map(i => <label key={i}>{grid.headers[i]}{field(i)}</label>)}
          <button disabled={saving}>Add row</button>
        </form>
      </details>
      <p>{grid.total} worksheet rows</p>
      {grid.rows.length > 0 && <div className="overflow-x-auto max-h-96"><table className="text-sm text-left whitespace-nowrap">
        <thead><tr><th className="p-2">Row</th>{grid.headers.map((h,i) => <th className="p-2" key={i}>{h}</th>)}</tr></thead>
        <tbody>{grid.rows.map(r => <tr className="border-t border-zinc-200" key={r.row}><td className="p-2"><button disabled={saving || !r.editable.length} onClick={() => { selectRow(r); selectColumn(r.editable[0]); }}>Edit {r.row}</button></td>{r.cells.map((v,i) => <td className="max-w-80 whitespace-normal break-words p-2" key={i}>{v}</td>)}</tr>)}</tbody>
      </table></div>}
      {grid.total > 25 && <div className="flex items-center gap-3"><button disabled={saving || !grid.page} onClick={() => setPage(grid.page-1)}>Previous</button>Page {grid.page+1}<button disabled={saving || (grid.page+1)*25 >= grid.total} onClick={() => setPage(grid.page+1)}>Next</button></div>}
      {row && <form className="space-y-3" onSubmit={e => {e.preventDefault(); void save(e.currentTarget,row);}}>
        <h3>Edit row {row.row}</h3>
        <div className="flex gap-2 flex-wrap">{row.editable.filter(i => /^(material( type)?$|amount (model|support)|approx\. amount|cost(\s*\(|$))/i.test(grid.headers[i].trim())).map(i => <button type="button" key={i} onClick={() => selectColumn(i)}>{grid.headers[i]} · {row.cells[i] || "Enter value"}</button>)}</div><label>Field<select value={column} onChange={e => selectColumn(Number(e.target.value))}>{row.editable.map(i => <option key={i} value={i}>{grid.headers[i]} (column {i+1})</option>)}</select></label>
        <label key={row.row+"-"+column}>Value{field(column,row.cells[column])}</label>
        <button disabled={saving}>Save cell</button>
      </form>}
    </>}
    <p role="status">{message}</p>
  </section>;
}
