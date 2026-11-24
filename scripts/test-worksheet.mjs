import { createHash, randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import layouts from './test-worksheet-headers.json' with { type: 'json' };

import tabIds from './test-worksheet-tabs.json' with { type: 'json' };

const template = readFileSync(new URL('../backend/apps-script/PriceEmail.gs',import.meta.url),'utf8');
const { priceMessage_, quoteAmount_ } = runInNewContext(template+'\n;({priceMessage_,quoteAmount_})');
const outbox = new Map();

function fieldKey(header) {
  const name = header.trim();
  if (/^(First and Last Name|Names \(First and Last\))$/i.test(name)) return 'member';
  if (/^Email Address$|^NAU Email \+/i.test(name)) return 'email';
  if (/^Capstone Speedchart$/i.test(name)) return 'team';
  if (/^Status$/i.test(name)) return 'status';
  if (/^Cost(?:\s*\(.*\))?$/i.test(name)) return 'cost';
  if (/^Timestamp$/i.test(name)) return 'submittedDate';
}

function rowCells(order,headers) {
  return headers.map((h,i) => String(order.worksheet?.[i] ?? order[fieldKey(h)] ?? ''));
}
export function testPriceEmail(p,orders) {
  const order = orders.get(p.code);
  if (!order) throw Error('Unknown test order.');
  const headers = layouts[order.printer] || [];
  const draft = priceMessage_(order,headers,rowCells(order,headers),'http://127.0.0.1:3184/orders');
  if (draft.error) return draft;
  const signature = createHash('sha256').update(JSON.stringify(draft)).digest('hex');
  if (p.action === 'previewPrice') return {...draft,signature,sent:outbox.has(signature)};
  if (p.signature !== signature) throw Error('The quote changed. Preview it again before sending.');
  outbox.set(signature,draft);
  return {sent:true};
}

export function testWorksheet(p, orders, sources = {}) {
  const headers = layouts[p.printer];
  if (!headers) throw Error('Choose a print-service machine.');
  const columns = headers.map((_,i) => i);
  const records = [...orders.values()].filter(o => o.printer === p.printer);
  const revision = o => JSON.stringify([o.code,rowCells(o,headers)]);
  if (p.action === 'worksheets') return {tabs:['F26 (test copy)']};
  if (p.tab !== 'F26 (test copy)') throw Error('Choose the test worksheet.');
  if (p.action === 'worksheet') {
    const page = Math.max(0,Math.min(Number(p.page)||0,Math.ceil(records.length/25)-1));
    const rows = records.map((o,i) => ({row:i+2,cells:rowCells(o,headers),editable:columns,revision:revision(o)}));
    const bookId = Object.keys(sources).find(id => sources[id] === p.printer);
    const sheetUrl = bookId ? 'https://docs.google.com/spreadsheets/d/'+bookId+'/edit#gid='+tabIds[p.printer] : undefined;
    return {sheetUrl,headers,columns,page,schema:'test',total:rows.length,rows:rows.reverse().slice(page*25,page*25+25)};
  }
  const changes = JSON.parse(p.changes);
  const entries = Object.entries(changes);
  if (!entries.length || entries.some(([k]) => !columns.includes(Number(k)))) throw Error('Choose a field.');
  const order = p.row ? records[Number(p.row)-2] : {code:'TEST-'+randomUUID().slice(0,8).toUpperCase(),printer:p.printer,member:'',email:'',team:'',status:'Queued',labNotes:'',files:[],cost:null,submittedDate:new Date().toISOString()};
  if (!order || (p.row && revision(order) !== p.revision)) throw Error('This row changed. Refresh before editing.');
  const next = {...order,worksheet:{...order.worksheet}};
  for (const [index,value] of entries) {
    const key = fieldKey(headers[index]);
    if (key === 'cost') {
      const amount = quoteAmount_(value);
      if (amount === null && value !== '') throw Error('Enter a valid print price.');
      next.cost = amount;
    } else if (key === 'email') {
      next.email = value.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0]?.toLowerCase() || '';
    } else if (key) next[key] = value;
    else next.worksheet[index] = value;
  }
  orders.set(next.code,next);
  return {saved:true};
}
