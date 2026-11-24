const TABLE = "IDEA Orders";
const STATES = [
  "Queued",
  "Ongoing",
  "Printing",
  "Ready for Pickup",
  "Completed",
  "Cancelled",
];
const HEADERS = [
  "Code",
  "Submitted",
  "Printer",
  "Status",
  "Student-visible note",
  "Email",
  "Source row",
  "Email sent",
  "Capstone number",
  "Submitted by",
  "Drive files",
  "Rate tier",
  "Material",
  "Model quantity",
  "Support quantity",
  "Support material",
  "Include job fee",
  "Unit",
  "Print cost USD",
  "Printer worksheet quote USD",
  "Price email signature",
  "Price email sent",
];

function setup() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty("STAFF_PASSWORD"))
    throw Error("Configure the staff password before setup.");
  props.setProperty("BOOK_ID", book.getId());
  let table = book.getSheetByName(TABLE);
  if (!table) {
    table = book.insertSheet(TABLE);
    table.appendRow(HEADERS);
    table.setFrozenRows(1);
  }
  if (
    table.getRange(1, 1, 1, 8).getValues()[0].join("|") !==
    HEADERS.slice(0, 8).join("|")
  )
    throw Error("Unexpected queue headers.");
  const extra = table.getRange(1, 9, 1, HEADERS.length - 8);
  if (extra.getValues()[0].some((v, i) => v && v !== HEADERS[i + 8]))
    throw Error("Conflicting queue columns after H.");
  extra.setValues([HEADERS.slice(8)]);
  const last = table.getLastRow();
  if (last > 1) installPricing_(table, 2, last - 1);
  for (const [column, choices] of [
    ["L", ["internal", "external"]],
    ["M", [...new Set(RATE_ROWS.map((r) => r[1]))]],
    ["P", [...new Set(RATE_ROWS.map((r) => r[1]))]],
    ["Q", ["Yes", "No"]],
  ]) {
    table
      .getRange(column + "2:" + column)
      .setDataValidation(
        SpreadsheetApp.newDataValidation()
          .requireValueInList(choices)
          .setAllowInvalid(false)
          .build(),
      );
  }
  table
    .getRange("D2:D")
    .setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(STATES)
        .setAllowInvalid(true)
        .build(),
    );
  const sources = Object.keys(
    JSON.parse(props.getProperty("SOURCE_BOOKS") || "{}"),
  );
  if (!sources.length) sources.push(book.getId());
  const installed = ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === "recordSubmission")
    .map((t) => t.getTriggerSourceId());
  const edits = ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === "intakeEditedRows").map(t => t.getTriggerSourceId());
  for (const id of sources) if (!edits.includes(id)) ScriptApp.newTrigger("intakeEditedRows").forSpreadsheet(id).onEdit().create();
  for (const id of sources)
    if (!installed.includes(id))
      ScriptApp.newTrigger("recordSubmission")
        .forSpreadsheet(id)
        .onFormSubmit()
        .create();
}

function locked_(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    return fn();
  } finally {
    try {
      SpreadsheetApp.flush();
    } finally {
      lock.releaseLock();
    }
  }
}

function match_(sheet, column, value) {
  if (sheet.getLastRow() < 2) return null;
  return sheet
    .getRange(2, column, sheet.getLastRow() - 1)
    .createTextFinder(value)
    .matchEntireCell(true)
    .useRegularExpression(false)
    .findNext();
}

function recordSubmission(e) {
  const source = e.range.getSheet();
  const printer = source.getName();
  const props = PropertiesService.getScriptProperties();
  const machines = JSON.parse(props.getProperty("PRINTER_TABS") || "{}");
  const machine =
    JSON.parse(props.getProperty("SOURCE_BOOKS") || "{}")[e.source.getId()] ||
    machines[printer];
  if (!machine) return;
  const answers = Object.fromEntries(
    Object.entries(e.namedValues).map(([k, v]) => [k.trim(), v]),
  );
  const address =
    answers[props.getProperty("EMAIL_HEADER") || "Email Address"] ||
    answers["NAU Email + 7 Digit ID"] ||
    answers["NAU Email + 7 Digit Number"];
  const email = String(address || "").match(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  )?.[0];
  if (!email) throw Error("Check the collected email header.");
  const sheet = SpreadsheetApp.openById(
    props.getProperty("BOOK_ID"),
  ).getSheetByName(TABLE);
  const key =
    e.source.getId() + "/" + source.getSheetId() + "/" + e.range.getRow();
  locked_(() => {
    const previous = match_(sheet, 7, key);
    let row;
    if (previous) row = previous.getRow();
    else {
      const code = newCode_(sheet);
      sheet.appendRow([
        code,
        source.getRange(e.range.getRow(), 1).getValue(),
        machine,
        STATES[0],
        "",
        email,
        key,
        "",
        ...formDetails_(answers).map(textCell_),
      ]);
      row = sheet.getLastRow();
      SpreadsheetApp.flush();
    }
    source.getRange(e.range.getRow(),refColumn_(source)).setValue(pricingReference_(sheet.getRange(row,1).getValue()));
    linkPricing_(sheet, row);
    installPricing_(sheet, row, 1);
    if (!sheet.getRange(row, 8).getValue()) sendCode_(sheet, row);
  });
}

function sendCode_(sheet, row) {
  const [code, , printer, , , email] = sheet
    .getRange(row, 1, 1, 6)
    .getValues()[0];
  MailApp.sendEmail(
    email,
    "IDEA Lab tracking code • " + printer,
    "Your " +
      printer +
      " order is queued.\n\nTracking code: " +
      code +
      "\n\nOpen Track an order on the IDEA Lab website and enter this code.",
  );
  sheet.getRange(row, 8).setValue(new Date());
}

function retryUnsentEmails() {
  locked_(() => {
    const sheet = SpreadsheetApp.openById(
      PropertiesService.getScriptProperties().getProperty("BOOK_ID"),
    ).getSheetByName(TABLE);
    sheet
      .getDataRange()
      .getValues()
      .slice(1)
      .forEach((r, i) => {
        if (r[0] && !r[7]) sendCode_(sheet, i + 2);
      });
  });
}

function publicOrder_(r) {
  return {
    submittedDate: new Date(r[1]).toISOString(),
    printer: r[2],
    status: r[3],
    labNotes: r[4],
    team: String(r[8] || ""),
    member: String(r[9] || ""),
    files: driveFiles_(r[10]),
    cost: typeof r[19] === "number" ? r[19] : typeof r[18] === "number" ? r[18] : null,
  };
}

function doPost(e) {
  let result;
  try {
    const p = JSON.parse(e.postData.contents);
    const props = PropertiesService.getScriptProperties();
    if (
      p.action !== "lookup" &&
      (!props.getProperty("STAFF_PASSWORD") ||
        p.password !== props.getProperty("STAFF_PASSWORD"))
    ) {
      result = { error: "Staff sign-in failed." };
    } else {
      const sheet = SpreadsheetApp.openById(
        props.getProperty("BOOK_ID"),
      ).getSheetByName(TABLE);
      result = handle_(sheet, p);
    }
  } catch (_) {
    result = {
      error: "The queue is temporarily unavailable. Please try again.",
    };
  }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function handle_(sheet, p) {
  if (["worksheets", "worksheet", "saveWorksheet"].includes(p.action)) return worksheetAction_(p);
  if (p.action === "create") return locked_(() => createManual_(sheet, p));
  if (p.action === "list") {
    const id = PropertiesService.getScriptProperties().getProperty("PRICE_BOOK");
    const totals = new Map();
    if (id) {
      const tab = SpreadsheetApp.openById(id).getSheetByName("Team print pricing");
      if (tab && tab.getLastRow() > 1) tab.getRange(2,9,tab.getLastRow()-1,5).getValues().forEach(r => { if (r[4]) totals.set(r[4],r[0]); });
    }
    return {
      orders: sheet
        .getDataRange()
        .getValues()
        .slice(1)
        .filter((r) => r[0])
        .reverse()
        .map(r => { const order = publicOrder_(r); const cost = totals.get(pricingReference_(r[0])); if (typeof r[19] !== "number" && typeof cost === "number") order.cost = cost; return {...order,code:r[0],email:r[5]}; }),
    };
  }
  if (
    !["lookup", "update", "previewPrice", "sendPrice"].includes(p.action) ||
    !/^IDEA-[A-F0-9]{16}$/.test(p.code)
  )
    return { error: "Invalid tracking code." };
  const work = () => {
    const cell = match_(sheet, 1, p.code);
    if (!cell) return { error: "No order matches that code." };
    const row = cell.getRow();
    const values = sheet.getRange(row, 1, 1, HEADERS.length).getValues()[0];
    if (
      p.action === "lookup" &&
      String(values[5]).toLowerCase() !==
        String(p.email || "")
          .trim()
          .toLowerCase()
    )
      return { error: "No order matches that code and email." };
    const order = publicOrder_(values);
    if (["lookup", "previewPrice", "sendPrice"].includes(p.action)) {
      const live = pricingRow_(values[0]);
      if (live && live.row) {
        const cost = live.tab.getRange(live.row, 9).getValue();
        if (typeof values[19] !== "number" && typeof cost === "number") order.cost = cost;
      }
      const source = sourceStatusCell_(values);
      const tab = source && source.getSheet();
      const headers = tab ? tab.getRange(1,1,1,tab.getLastColumn()).getDisplayValues()[0] : [];
      const fields = tab ? tab.getRange(source.getRow(),1,1,headers.length).getValues()[0] : [];
      const costIndex = headers.findIndex(h => /^cost(?:\s*\(.*\))?$/i.test(h.trim()));
      if (costIndex >= 0 && fields[costIndex] !== "") order.cost = quoteAmount_(fields[costIndex]);
      if (p.action === "lookup") return { order };
      if (tab) {
        const names = headers.map(h => h.trim());
        const emailHeaders = [PropertiesService.getScriptProperties().getProperty("EMAIL_HEADER") || "Email Address", "NAU Email + 7 Digit ID", "NAU Email + 7 Digit Number"];
        const email = emailHeaders.map(h => String(fields[names.indexOf(h)] || "").match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0]).find(Boolean);
        if (!email || email.toLowerCase() !== String(values[5]).trim().toLowerCase())
          return {error:"The student email differs from the linked order. Verify the worksheet email before sending."};
      }
      const draft = priceMessage_({...order,code:values[0],email:String(values[5]).trim()},headers,fields,
        propsTrackingUrl_());
      if (draft.error) return draft;
      const signature = pricingReference_(JSON.stringify(draft));
      const same = values[20] === signature;
      if (p.action === "previewPrice") return {...draft,signature,sent:same && Boolean(values[21])};
      if (signature !== p.signature) return {error:"The quote changed. Preview it again before sending."};
      if (same && values[21]) return {sent:true};
      if (same) return {error:"Delivery is unconfirmed. Check the lab mailbox before retrying."};
      const receipt = sheet.getRange(row,21,1,2);
      receipt.setValues([[signature,""]]);
      SpreadsheetApp.flush();
      MailApp.sendEmail(draft.to,draft.subject,draft.body);
      receipt.setValues([[signature,new Date()]]);
      return {sent:true};
    }
    if (
      (!STATES.includes(p.status) && p.status !== order.status) ||
      typeof p.note !== "string" ||
      p.note.length > 500
    )
      return { error: "Invalid status or note." };
    if (order.status !== p.previousStatus || order.labNotes !== p.previousNote)
      return { error: "This order changed. Refresh the queue before saving." };
    const statusCell = sourceStatusCell_(values);
    if (statusCell && p.status !== order.status) statusCell.setValue(p.status);
    sheet
      .getRange(row, 4, 1, 2)
      .setValues([[p.status, p.note ? "'" + p.note : ""]]);
    return { saved: true };
  };
  return ["update","sendPrice"].includes(p.action) ? locked_(work) : work();
}

// Formula inputs follow the queue columns L:Q. Recalculate whenever staff edit a quantity.
function IDEAPRINTCOST(
  printer,
  tier,
  material,
  model,
  support,
  labor,
  overhead,
) {
  if (model === "" || model == null || !tier || !material) return "";
  const rate = RATE_ROWS.find((r) => r[0] === printer && r[1] === material);
  if (!rate || !["internal", "external"].includes(tier))
    return "Check printer/material/tier";
  if (
    typeof model !== "number" ||
    model < 0 ||
    (support !== "" && (typeof support !== "number" || support < 0))
  )
    return "Check quantities";
  const index = tier === "internal" ? 3 : 4;
  const secondary = RATE_ROWS.find((r) => r[0] === printer && r[1] === labor);
  if (Number(support) > 0 && !secondary) return "Select support material";
  const total =
    model * rate[index] +
    Number(support) * (secondary ? secondary[index] : 0) +
    (overhead === "Yes" ? rate[index + 2] : 0);
  return Math.round((total + Number.EPSILON) * 100) / 100;
}

function installPricing_(sheet, row, count) {
  const formulas = Array.from({ length: count }, (_, i) => {
    const n = row + i;
    return [
      "=IDEAUNIT(C" + n + ")",
      "=IDEAPRINTCOST(C" +
        n +
        ",L" +
        n +
        ",M" +
        n +
        ",N" +
        n +
        ",O" +
        n +
        ",P" +
        n +
        ",Q" +
        n +
        ")",
    ];
  });
  sheet.getRange(row, 18, count, 2).setFormulas(formulas);
  sheet.getRange(row, 19, count).setNumberFormat('"$"0.00');
}

function IDEAUNIT(printer) {
  const rate = RATE_ROWS.find((r) => r[0] === printer);
  return rate ? rate[2] : "";
}

function driveFiles_(value) {
  return [
    ...new Set(
      String(value || "").match(
        /https:\/\/drive\.google\.com\/[^\s,;<>"]+/gi,
      ) || [],
    ),
  ];
}
function textCell_(v) {
  return v ? "'" + String(v) : "";
}

function formDetails_(answers) {
  const fields = JSON.parse(
    PropertiesService.getScriptProperties().getProperty("ORDER_FIELDS") || "{}",
  );
  const read = (key, defaultName) =>
    String((answers[fields[key] || defaultName] || []).join(", ")).trim();
  return [
    read("team", "Capstone Speedchart"),
    read("member", "First and Last Name") ||
      read("member", "Names (First and Last)"),
    driveFiles_(
      fields.files
        ? read("files", "")
        : Object.entries(answers)
            .filter(([k]) => /^file upload/i.test(k))
            .map(([, v]) => v.join(" "))
            .join(" "),
    ).join("\n"),
    read("tier", "Rate tier").toLowerCase(),
    read("material", "Material Type") || read("material", "Material"),
  ];
}

function newCode_(sheet) {
  let code;
  do {
    code =
      "IDEA-" +
      Utilities.getUuid().slice(0, 8).toUpperCase() +
      Utilities.getUuid().slice(0, 8).toUpperCase();
  } while (match_(sheet, 1, code));
  return code;
}

function createManual_(sheet, p) {
  if (
    !/^[a-f0-9-]{36}$/i.test(p.requestId) ||
    !/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(p.email) ||
    !String(p.member || "").trim()
  )
    return { error: "Check the submitter and email." };
  if (
    !RATE_ROWS.some(
      (r) =>
        r[0] === p.printer &&
        ["internal", "external"].includes(p.tier) &&
        r[1] === p.material,
    )
  )
    return { error: "Check the machine, rate tier and material." };
  const files = driveFiles_(p.files);
  if (
    String(p.files || "").trim() &&
    files.length !== String(p.files).trim().split(/\s+/).length
  )
    return { error: "Use one Google Drive file link per line." };
  const key = "manual/" + p.requestId;
  const existing = match_(sheet, 7, key);
  const row = existing ? existing.getRow() : sheet.getLastRow() + 1;
  if (!existing)
    sheet.appendRow([
      newCode_(sheet),
      new Date(),
      p.printer,
      "Ongoing",
      "",
      textCell_(p.email),
      key,
      "",
      ...[p.team, p.member, files.join("\n"), p.tier, p.material].map(
        textCell_,
      ),
    ]);
  ensureManualResponse_(sheet,row);
  linkPricing_(sheet, row);
  installPricing_(sheet, row, 1);
  if (!sheet.getRange(row, 8).getValue()) sendCode_(sheet, row);
  return { code: sheet.getRange(row, 1).getValue() };
}

function pricingReference_(code) {
  return Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, code),
  ).slice(0, 20);
}
function pricingRow_(code) {
  const id = PropertiesService.getScriptProperties().getProperty("PRICE_BOOK");
  if (!id) return null;
  const tab = SpreadsheetApp.openById(id).getSheetByName("Team print pricing");
  const ref = pricingReference_(code);
  const cell = match_(tab, 13, ref);
  return { tab, ref, row: cell ? cell.getRow() : null };
}
function linkPricing_(sheet, row) {
  const v = sheet.getRange(row, 1, 1, 13).getValues()[0];
  const live = pricingRow_(v[0]);
  if (!live || live.row) return;
  const occupied = live.tab.getRange("A2:E").getValues();
  const refs = live.tab.getRange("M2:M").getValues();
  let index = occupied.findIndex(
    (r, i) => !refs[i][0] && r.every((x) => x === ""),
  );
  if (index < 0) {
    live.tab.insertRowsAfter(live.tab.getMaxRows(), 1);
    index = occupied.length;
  }
  const selected = RATE_ROWS.some((r) => r[0] === v[2] && r[1] === v[12])
    ? v[2] + " • " + v[12]
    : "";
  live.tab
    .getRange(index + 2, 1, 1, 4)
    .setValues([
      [
        textCell_(v[8]),
        textCell_(v[9]),
        selected,
        { internal: "Internal", external: "External" }[v[11]] || "",
      ],
    ]);
  live.tab.getRange(index + 2, 13).setValue(live.ref);
}

function propsTrackingUrl_() {
  return PropertiesService.getScriptProperties().getProperty("TRACKING_URL") || "https://ce.nau.edu/me/idealab/orders/";
}
