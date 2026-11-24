import http from 'node:http';
import { testWorksheet, testPriceEmail } from './test-worksheet.mjs';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import next from 'next';
import { sliceSTL } from './slice-bambu.mjs';

const setupFile = new URL('../backend/apps-script/StaffSetup.local.gs', import.meta.url);
const setup = await readFile(setupFile, 'utf8').catch(() => '');
const staffPassword = process.env.LAB_TEST_PASSWORD || setup.match(/setProperty\("STAFF_PASSWORD", "([^"]+)"\)/)?.[1];
if (!staffPassword) throw Error('Set LAB_TEST_PASSWORD or configure StaffSetup.local.gs before starting the preview.');
const sources = JSON.parse(setup.match(/'SOURCE_BOOKS', '([^']+)'/)?.[1] || '{}');
const port = 3184;
const host = '127.0.0.1';
const origin = 'http://' + host + ':' + port;
const app = next({ dev: true, hostname: host, port });
await app.prepare();
const handle = app.getRequestHandler();
const restoredOrders = process.env.LAB_TEST_SNAPSHOT
  ? JSON.parse(await readFile(process.env.LAB_TEST_SNAPSHOT, 'utf8'))
  : [];
const orders = new Map(restoredOrders.map(order => [order.code, order]));
const requests = new Map();
let slicing = false;

async function body(req, limit) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw Error('This file exceeds the test upload limit.');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

http.createServer(async (req, res) => {
  if (req.headers.host !== new URL(origin).host) {
    res.writeHead(403).end();
    return;
  }
  if (!req.url.startsWith('/lab-test/')) return handle(req, res);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method !== 'POST' || req.headers.origin !== origin) throw Error('Open the local test page to continue.');
    if (req.url === '/lab-test/slice') {
      if (slicing) throw Error('The slicer is busy. Try again in a moment.');
      slicing = true;
      try {
        const grams = await sliceSTL(await body(req, 32 * 1024 * 1024));
        res.end(JSON.stringify({ grams }));
      } catch (err) {
        console.error(err.message.split('\n')[0]);
        throw Error('The X1C could not slice this STL. Check the file and bed size. The upload limit is 32 MB.');
      } finally {
        slicing = false;
      }
      return;
    }
    if (req.url !== '/lab-test/orders') throw Error('Unknown test route.');
    const p = JSON.parse((await body(req, 65536)).toString());
    let result;
    if (p.action === 'student' || p.action === 'create') {
      if (/\bA1\b/i.test(p.printer)) throw Error('The A1 is available for student checkout only.');
      if (p.action === 'create' && p.password !== staffPassword) throw Error('Incorrect test password.');
      const code = requests.get(p.requestId) || 'TEST-' + randomUUID().slice(0, 8).toUpperCase();
      if (!orders.has(code)) orders.set(code, { code, email: p.email.trim().toLowerCase(), member: p.member,
        printer: p.printer, team: p.team || '', status: p.action === 'student' ? 'Ongoing' : 'Queued',
        cost: p.action === 'student' ? Number(p.cost) : null, files: [], labNotes: '', submittedDate: new Date().toISOString() });
      requests.set(p.requestId, code);
      result = { code };
    } else if (p.action === 'lookup') {
      const order = orders.get(p.code);
      if (!order || order.email !== p.email.trim().toLowerCase()) throw Error('Check your test code and email.');
      result = { order };
    } else {
      if (p.password !== staffPassword) throw Error('Incorrect test password.');
      if (p.action === 'list') result = { orders: [...orders.values()].reverse() };
      else if (['previewPrice','sendPrice'].includes(p.action)) result = testPriceEmail(p,orders);
      else if (['worksheets','worksheet','saveWorksheet'].includes(p.action)) result = testWorksheet(p,orders,sources);
      else if (p.action === 'update') {
        const order = orders.get(p.code);
        if (!order || order.status !== p.previousStatus || order.labNotes !== p.previousNote) throw Error('Refresh the queue and try again.');
        Object.assign(order, { status: p.status, labNotes: p.note });
        result = { ok: true };
      } else throw Error('Unknown test action.');
    }
    res.end(JSON.stringify(result));
  } catch (err) {
    res.end(JSON.stringify({ error: err.message }));
  }
}).listen(port, host, () => console.log('Test calculator at ' + origin + '/order'));
