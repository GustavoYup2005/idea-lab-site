// Staff worksheet actions use only the configured printer workbooks and the pricing inputs.
function worksheetAction_(p) {
  const props = PropertiesService.getScriptProperties();
  const sources = JSON.parse(props.getProperty("SOURCE_BOOKS") || "{}");
  const id = Object.keys(sources)
    .find(key => sources[key] === p.printer);
  if (!id) return { error: "Choose a configured printer." };
  const book = SpreadsheetApp.openById(id);
  const terms = book.getSheets().filter(tab => /^(?:F|S|Su)\d{2}$/i.test(tab.getName()));
  const pricing = props.getProperty("PRICE_BOOK");
  if (p.action === "worksheets") return { tabs: terms.map(t => t.getName()).concat(pricing ? ["Team print pricing"] : []) };
  const isPrice = p.tab === "Team print pricing";
  const tab = isPrice && pricing ? SpreadsheetApp.openById(pricing).getSheetByName(p.tab) : terms.find(t => t.getName() === p.tab);
  if (!tab) return { error: "Choose a worksheet for this printer." };
  const width = isPrice ? 9 : tab.getLastColumn();
  const headers = tab.getRange(1, 1, 1, width).getDisplayValues()[0];
  const columns = headers.map((name,i) => name && name !== RESPONSE_REF && (!isPrice || [0,1,2,3,4,7].includes(i)) ? i : -1).filter(i => i >= 0);
  const belongs = values => !isPrice || String(values[2]).startsWith(p.printer + " • ");
  const digest = parts => Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, JSON.stringify(parts)));
  const signature = (values, formulas) => digest([headers, values, formulas]);
  const populated = values => values.some(v => v !== "" && v !== false);
  if (p.action === "worksheet") {
    const count = Math.max(tab.getLastRow() - 1, 0);
    let rows = [];
    if (count) {
      const range = tab.getRange(2, 1, count, width);
      const values = range.getValues(), displays = range.getDisplayValues(), formulas = range.getFormulas();
      for (let i = count - 1; i >= 0; i--) {
        if (belongs(values[i]) && populated(values[i])) rows.push({
          row: i + 2, cells: displays[i], revision: signature(values[i], formulas[i]),
          editable: columns.filter(col => !formulas[i][col]),
        });
      }
    }
    const page = Math.max(0, Math.min(Number(p.page) || 0, Math.ceil(rows.length / 25) - 1));
    return { sheetUrl:tab.getParent().getUrl().split("#")[0]+"#gid="+tab.getSheetId(), headers, columns, total: rows.length, page, rows: rows.slice(page * 25, page * 25 + 25), schema: digest(headers) };
  }
  return locked_(() => {
    if (p.schema !== digest(headers)) return { error: "Worksheet columns changed. Refresh before saving." };
    const changes = JSON.parse(p.changes);
    const indices = Object.keys(changes).map(Number);
    if (!indices.length || indices.some(i => !columns.includes(i) || typeof changes[i] !== "string")) return { error: "Choose an editable field." };
    if (isPrice && (2 in changes) && !RATE_ROWS.some(r => r[0] === p.printer && changes[2] === r[0] + " • " + r[1])) return { error: "Choose a material for this printer." };
    if (isPrice && 3 in changes && !["","Internal","External"].includes(changes[3])) return { error: "Use Internal or External for the rate tier." };
    if (isPrice && 4 in changes && changes[4] !== "" && !(Number.isFinite(Number(changes[4])) && Number(changes[4]) >= 0)) return { error: "Enter a nonnegative quantity." };
    if (isPrice && 7 in changes && !/^(true|false)$/i.test(changes[7])) return { error: "Use TRUE or FALSE for the job fee." };
    const priceColumn = headers.findIndex(h => /^cost(?:\s*\(.*\))?$/i.test(h.trim()));
    if (priceColumn in changes && changes[priceColumn] !== "" && quoteAmount_(changes[priceColumn]) === null)
      return {error:"Enter a nonnegative print price in USD."};
    const convert = i => {
      const v = changes[i];
      if (v === "") return "";
      if (!isPrice && i === priceColumn) return quoteAmount_(v);
      if (isPrice && i === 4) return Number(v);
      if (/^(true|false)$/i.test(v)) return v.toLowerCase() === "true";
      return v.startsWith("=") ? "'" + v : v;
    };
    if (p.row) {
      const n = Number(p.row);
      if (!Number.isInteger(n) || n < 2 || n > tab.getLastRow() || indices.length !== 1) return { error: "Choose one current worksheet cell." };
      const range = tab.getRange(n, 1, 1, width);
      const values = range.getValues()[0], formulas = range.getFormulas()[0], i = indices[0];
      if (!belongs(values) || formulas[i] || p.revision !== signature(values, formulas)) return { error: "This row changed. Refresh before editing." };
      tab.getRange(n, i + 1).setValue(convert(i));
      if (!isPrice) syncResponse_(tab,n,p.printer);
    } else {
      if (isPrice && !changes[2]) return { error: "Select the machine and material." };
      const inputs = Array(width).fill("");
      indices.forEach(i => { inputs[i] = convert(i); });
      if (!populated(inputs)) return { error: "Enter at least one value." };
      if (!isPrice) {
        if (headers[0].trim() === "Timestamp" && !inputs[0]) inputs[0] = new Date();
        tab.appendRow(inputs);
        syncResponse_(tab,tab.getLastRow(),p.printer);
      } else {
        const all = tab.getRange(2, 1, tab.getMaxRows()-1, 13).getValues();
        const free = all.findIndex(r => r.slice(0,5).every(v => v === "") && !r[7] && !r[12]);
        const n = free < 0 ? tab.getMaxRows()+1 : free+2;
        if (n > tab.getMaxRows()) tab.insertRowAfter(tab.getMaxRows());
        // H is a checkbox; F:G and I contain spill formulas.
        if (inputs[7]) tab.getRange(n,8).setValue(true);
        tab.getRange(n,1,1,5).setValues([inputs.slice(0,5)]);
      }
    }
    return { saved: true };
  });
}

// Link a printer response row to its tracking order independently of sort order.
const RESPONSE_REF = "IDEA order reference";
function refColumn_(tab) {
  const width = tab.getLastColumn();
  const i = tab.getRange(1,1,1,width).getValues()[0].indexOf(RESPONSE_REF);
  if (i >= 0) return i + 1;
  if (width === tab.getMaxColumns()) tab.insertColumnAfter(width);
  tab.getRange(1,width+1).setValue(RESPONSE_REF);
  return width+1;
}
function intakeEditedRows(e) {
  const tab = e.range.getSheet();
  if (!/^(?:F|S|Su)\d{2}$/i.test(tab.getName())) return;
  const props = PropertiesService.getScriptProperties();
  const printer = JSON.parse(props.getProperty("SOURCE_BOOKS") || "{}")[e.source.getId()];
  if (!printer) return;
  locked_(() => {
    for (let n = Math.max(2,e.range.getRow()); n <= e.range.getLastRow(); n++) syncResponse_(tab,n,printer);
  });
}
function syncResponse_(tab,n,printer) {
  const props = PropertiesService.getScriptProperties();
  const width = tab.getLastColumn();
  const names = tab.getRange(1,1,1,width).getDisplayValues()[0].map(h => h.trim());
  const row = tab.getRange(n,1,1,width).getValues()[0];
  const fields = {};
  names.forEach((name,i) => { if (row[i] !== "") (fields[name] ||= []).push(String(row[i])); });
  const email = String(fields[props.getProperty("EMAIL_HEADER") || "Email Address"] || fields["NAU Email + 7 Digit ID"] || fields["NAU Email + 7 Digit Number"] || "").match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0];
  if (!email) return;
  const queue = SpreadsheetApp.openById(props.getProperty("BOOK_ID")).getSheetByName(TABLE);
  const key = tab.getParent().getId()+"/"+tab.getSheetId()+"/"+n;
  const ref = row[names.indexOf(RESPONSE_REF)];
  const records = queue.getDataRange().getValues();
  let index = ref ? records.findIndex((r,i) => i && r[0] && pricingReference_(r[0]) === ref) :
    records.findIndex((r,i) => i && r[6] === key && +new Date(r[1]) === +new Date(row[0]));
  if (ref && index < 1) return;
  const details = formDetails_(fields);
  const status = String(row[names.indexOf("Status")] || "").trim();
  if (index < 1) {
    const code = newCode_(queue);
    queue.appendRow([code,row[0] instanceof Date ? row[0] : new Date(),printer,textCell_(status || "Queued"),"",textCell_(email),key,"",...details.map(textCell_)]);
    index = queue.getLastRow()-1;
  } else {
    if (status) queue.getRange(index+1,4).setValue(textCell_(status));
    queue.getRange(index+1,6).setValue(textCell_(email));
    if (!String(records[index][6]).startsWith("manual/")) queue.getRange(index+1,7).setValue(key);
    queue.getRange(index+1,9,1,3).setValues([details.slice(0,3).map(textCell_)]);
  }
  const priceIndex = names.findIndex(h => /^cost(?:\s*\(.*\))?$/i.test(h));
  if (priceIndex >= 0) queue.getRange(index+1,20).setValue(quoteAmount_(row[priceIndex]) ?? "");
  if (!ref) tab.getRange(n,refColumn_(tab)).setValue(pricingReference_(queue.getRange(index+1,1).getValue()));
  linkPricing_(queue,index+1);
  installPricing_(queue,index+1,1);
}

function sourceStatusCell_(values) {
  const parts = String(values[6]).split("/");
  if (parts[0] === "manual") {
    const sources = JSON.parse(PropertiesService.getScriptProperties().getProperty("SOURCE_BOOKS") || "{}");
    const id = Object.keys(sources).find(k => sources[k] === values[2]);
    if (!id) return null;
    for (const tab of SpreadsheetApp.openById(id).getSheets()) {
      if (!/^(F|S|Su)\d{2}$/i.test(tab.getName())) continue;
      const headers = tab.getRange(1,1,1,tab.getLastColumn()).getDisplayValues()[0];
      const col = headers.indexOf(RESPONSE_REF), status = headers.findIndex(h => h.trim() === "Status");
      const cell = col >= 0 && status >= 0 && match_(tab,col+1,pricingReference_(values[0]));
      if (cell) return tab.getRange(cell.getRow(),status+1);
    }
    return null;
  }
  if (parts.length !== 3) return null;
  const book = SpreadsheetApp.openById(parts[0]);
  const tab = book.getSheets().find(t => String(t.getSheetId()) === parts[1]);
  if (!tab) return null;
  const headers = tab.getRange(1,1,1,tab.getLastColumn()).getDisplayValues()[0];
  const status = headers.findIndex(h => h.trim() === "Status");
  if (status < 0) return null;
  const ref = headers.indexOf(RESPONSE_REF);
  const linked = ref >= 0 && match_(tab, ref+1, pricingReference_(values[0]));
  const n = linked ? linked.getRow() : Number(parts[2]);
  if (!linked && (n > tab.getLastRow() || +new Date(tab.getRange(n,1).getValue()) !== +new Date(values[1]))) return null;
  return tab.getRange(n,status+1);
}
function ensureManualResponse_(queue, n) {
  const props = PropertiesService.getScriptProperties();
  const sources = JSON.parse(props.getProperty("SOURCE_BOOKS") || "{}");
  const values = queue.getRange(n,1,1,HEADERS.length).getValues()[0];
  const id = Object.keys(sources).find(k => sources[k] === values[2]);
  if (!id) return;
  const tabs = SpreadsheetApp.openById(id).getSheets().filter(t => /^(F|S|Su)\d{2}$/i.test(t.getName()));
  const tab = tabs[0];
  if (!tab) throw Error("Missing current semester worksheet.");
  const col = refColumn_(tab);
  const ref = pricingReference_(values[0]);
  if (match_(tab,col,ref)) return;
  const headers = tab.getRange(1,1,1,tab.getLastColumn()).getDisplayValues()[0];
  const row = Array(headers.length).fill("");
  function fill(regex,value) {
    const index = headers.findIndex(h => regex.test(h.trim()));
    if (index >= 0) row[index] = value;
  }
  fill(/^Timestamp$/i,values[1]);
  fill(/^First and Last Name$|^Names \(First and Last\)$/i,textCell_(values[9]));
  fill(/^Email Address$|^NAU Email \+/i,textCell_(values[5]));
  fill(/^Capstone Speedchart$/i,textCell_(values[8]));
  fill(/^File Upload/i,textCell_(values[10]));
  fill(/^Material( Type)?$/i,textCell_(values[12]));
  fill(/^Status$/i,values[3]);
  row[col-1] = ref;
  tab.appendRow(row);
}
