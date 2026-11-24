// Shared by Apps Script and the isolated local preview.
function quoteAmount_(value) {
  if (value === "" || value == null) return null;
  const text = String(value).trim();
  if (!/^\$?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(text)) return null;
  const amount = Number(text.replace(/[$,]/g, ""));
  return Number.isFinite(amount) ? Math.round(amount * 100) / 100 : null;
}

function priceMessage_(order, headers, cells, trackingUrl) {
  const costIndex = headers.findIndex(h => /^cost(?:\s*\(.*\))?$/i.test(h.trim()));
  const explicit = costIndex < 0 ? "" : cells[costIndex];
  const amount = quoteAmount_(explicit === "" || explicit == null ? order.cost : explicit);
  if (amount === null) return {error:"Enter a valid print price before sending confirmation."};
  if (!/^[\w.+-]+@[\w.-]+\.[a-z]{2,}$/i.test(order.email)) return {error:"Check the student's submission email."};
  const details = [];
  headers.forEach((header,i) => {
    if (/^(material(?: type)?$|preferred material|quantity\.?$|amount (model|support)|approx\. amount|print time$|description\b)/i.test(header.trim()) && cells[i] !== "" && cells[i] != null)
      details.push(header.trim() + ": " + cells[i]);
  });
  if (order.team) details.push("Capstone: " + order.team);
  const body = [
    "Hello" + (order.member ? " " + order.member : "") + ",",
    "", "The IDEA Lab has priced your " + order.printer + " print request.",
    "Print price: $" + amount.toFixed(2), ...details,
    "", "Tracking code: " + order.code, "Track your order: " + trackingUrl,
    "Enter the tracking code and your submission email (" + order.email + ") to see your order.",
    "", "NAU IDEA Lab",
  ].join("\n");
  return {to:order.email, subject:"IDEA Lab print quote · " + order.printer + " · " + order.code, body};
}
