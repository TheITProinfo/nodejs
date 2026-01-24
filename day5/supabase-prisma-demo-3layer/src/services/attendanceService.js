const employeeRepo = require("../repositories/employeeRepo");
const attendanceRepo = require("../repositories/attendanceRepo");
const { httpError } = require("./_errors");
const { toDateOnlyUTC, validateStatus } = require("./_helpers");

async function resolveEmployeeId({ employeeId, employeeNo }) {
  if (employeeId) return String(employeeId);

  if (!employeeNo?.trim()) throw httpError(400, "employeeId or employeeNo is required");
  const emp = await employeeRepo.findByEmployeeNo(employeeNo.trim());
  if (!emp) throw httpError(404, "employee not found");
  return emp.id;
}

// POST /api/attendance （当天 upsert）
async function upsertToday(payload) {
  const empId = await resolveEmployeeId(payload);
  const workDate = toDateOnlyUTC(payload.workDate); // 不传则 today

  const finalStatus = validateStatus(payload.status);

  // 允许不传 checkIn：课堂 demo 更方便（默认现在时间）
  const checkIn = payload.checkIn ? new Date(payload.checkIn) : new Date();
  if (payload.checkIn && Number.isNaN(checkIn.getTime())) throw httpError(400, "Invalid checkIn datetime (use ISO)");

  const checkOut = payload.checkOut ? new Date(payload.checkOut) : null;
  if (payload.checkOut && Number.isNaN(checkOut.getTime())) throw httpError(400, "Invalid checkOut datetime (use ISO)");

  return attendanceRepo.upsertAttendance({
    employeeId: empId,
    workDate,
    checkIn,
    checkOut,
    status: finalStatus,
    note: payload.note ?? "Saved via API",
  });
}

// GET /api/attendance?employeeId=...&from=...&to=...
async function getRange(query) {
  const empId = await resolveEmployeeId(query);
  if (!query.from || !query.to) throw httpError(400, "from and to are required (YYYY-MM-DD)");

  const fromDate = toDateOnlyUTC(query.from);
  const toDate = toDateOnlyUTC(query.to);
  if (toDate < fromDate) throw httpError(400, "to must be >= from");

  const records = await attendanceRepo.findByEmployeeAndRange({ employeeId: empId, fromDate, toDate });
  return { employeeId: empId, from: query.from, to: query.to, records };
}

// GET /api/attendance/today（全部员工或按 employeeId/employeeNo）
async function today(query) {
  const workDate = toDateOnlyUTC(); // today UTC 00:00
  const empId = query.employeeId || query.employeeNo ? await resolveEmployeeId(query) : undefined;

  const records = await attendanceRepo.findToday({ workDate, employeeId: empId });

  // 简单报表汇总
  const byStatus = records.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  return {
    date: workDate.toISOString().slice(0, 10),
    totalRecords: records.length,
    byStatus,
    records,
  };
}

module.exports = { upsertToday, getRange, today };
