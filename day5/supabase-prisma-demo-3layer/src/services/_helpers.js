function toDateOnlyUTC(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();
  if (Number.isNaN(d.getTime())) {
    const e = new Error("Invalid date. Use YYYY-MM-DD");
    e.statusCode = 400;
    throw e;
  }
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function validateStatus(status) {
  const allowed = ["PRESENT", "ABSENT", "LATE", "SICK", "VACATION"];
  const s = String(status || "PRESENT").toUpperCase();
  if (!allowed.includes(s)) {
    const e = new Error("Invalid status. Use: PRESENT, ABSENT, LATE, SICK, VACATION");
    e.statusCode = 400;
    throw e;
  }
  return s;
}

module.exports = { toDateOnlyUTC, validateStatus };
