const employeeRepo = require("../repositories/employeeRepo");
const attendanceRepo = require("../repositories/attendanceRepo");
const { httpError } = require("./_errors");
const { toDateOnlyUTC, validateStatus } = require("./_helpers");

// 计算工时（分钟/小时）
function calcWorkMinutes(checkIn, checkOut) {
  if (!checkIn || !checkOut) return null;
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  if (Number.isNaN(ms)) return null;
  return Math.max(Math.floor(ms / 60000), 0);
}

function toHours(minutes) {
  if (minutes === null) return null;
  return Math.round((minutes / 60) * 100) / 100; // 保留两位小数
}

async function upsertAttendance({ employeeNo, workDate, checkIn, checkOut, status, note }) {
  if (!employeeNo?.trim()) throw httpError(400, "employeeNo is required");

  const emp = await employeeRepo.findByEmployeeNo(employeeNo.trim());
  if (!emp) throw httpError(404, "employee not found");

  // 归零后的工作日期
  const day = toDateOnlyUTC(workDate);

  // 先查当天已有记录（用于 checkout-only 场景）
  // 要求你的 attendanceRepo 有这个方法（建议你加）
  // findByEmployeeAndWorkDate({ employeeId, workDate })
  const existing = await attendanceRepo.findByEmployeeAndWorkDate({
    employeeId: emp.id,
    workDate: day,
  });

  // 仅当用户传入时才设置；否则用 undefined 表示“不更新”
  let checkInValue = undefined;
  let checkOutValue = undefined;

  if (checkIn !== undefined && checkIn !== null) {
    const d = new Date(checkIn);
    if (Number.isNaN(d.getTime())) throw httpError(400, "Invalid checkIn datetime (use ISO)");
    checkInValue = d;
  }

  if (checkOut !== undefined && checkOut !== null) {
    const d = new Date(checkOut);
    if (Number.isNaN(d.getTime())) throw httpError(400, "Invalid checkOut datetime (use ISO)");
    checkOutValue = d;
  }

  // 如果两者都没传：当作 check-in（默认现在时间）
  if (checkInValue === undefined && checkOutValue === undefined) {
    checkInValue = new Date();
  }

  // checkout-only：必须已有 checkIn
  if (checkOutValue !== undefined && checkInValue === undefined) {
    if (!existing || !existing.checkIn) {
      throw httpError(400, "Cannot check-out without an existing check-in for the day");
    }
    if (checkOutValue.getTime() < new Date(existing.checkIn).getTime()) {
      throw httpError(400, "checkOut cannot be earlier than checkIn");
    }
  }

  // 同时传 checkIn/checkOut 时校验顺序
  if (checkInValue && checkOutValue && checkOutValue.getTime() < checkInValue.getTime()) {
    throw httpError(400, "checkOut cannot be earlier than checkIn");
  }

  // status：只在传入时才更新；不传就不动（避免 checkout 时把状态强制改掉）
  const finalStatus = status !== undefined ? validateStatus(status) : undefined;

  // 注意：要保证 attendanceRepo.upsertAttendance 的 update 部分支持“只更新传入字段”
  const saved = await attendanceRepo.upsertAttendance({
    employeeId: emp.id,
    workDate: day,
    checkIn: checkInValue,   // undefined -> 不更新
    checkOut: checkOutValue, // undefined -> 不更新
    status: finalStatus,     // undefined -> 不更新
    note,                    // undefined -> 不更新（由 repo 控制）
  });

  // 计算工时：用保存后的数据
  const workMinutes = calcWorkMinutes(saved.checkIn, saved.checkOut);
  const workHours = toHours(workMinutes);

  return {
    ...saved,
    workMinutes,
    workHours,
  };
}

async function getRange({ employeeNo, from, to }) {
  if (!employeeNo?.trim()) throw httpError(400, "employeeNo is required");
  if (!from || !to) throw httpError(400, "from and to are required (YYYY-MM-DD)");

  const emp = await employeeRepo.findByEmployeeNo(employeeNo.trim());
  if (!emp) throw httpError(404, "employee not found");

  const fromDate = toDateOnlyUTC(from);
  const toDate = toDateOnlyUTC(to);
  if (toDate < fromDate) throw httpError(400, "to must be >= from");

  const records = await attendanceRepo.findByEmployeeAndRange({
    employeeId: emp.id,
    fromDate,
    toDate,
  });

  // Range 也带上工时
  const recordsWithHours = records.map((r) => {
    const workMinutes = calcWorkMinutes(r.checkIn, r.checkOut);
    return {
      ...r,
      workMinutes,
      workHours: toHours(workMinutes),
    };
  });

  return { employee: emp, records: recordsWithHours };
}

module.exports = { upsertAttendance, getRange };
