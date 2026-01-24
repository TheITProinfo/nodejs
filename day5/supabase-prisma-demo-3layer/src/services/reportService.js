const employeeRepo = require("../repositories/employeeRepo");
const attendanceRepo = require("../repositories/attendanceRepo");
const { httpError } = require("./_errors");
const { toDateOnlyUTC, validateStatus } = require("./_helpers");

async function today({ status, employeeNo }) {
  const workDate = toDateOnlyUTC();
  let employeeId;

  if (employeeNo?.trim()) {
    const emp = await employeeRepo.findByEmployeeNo(employeeNo.trim());
    if (!emp) throw httpError(404, "employee not found");
    employeeId = emp.id;
  }

  const finalStatus = status ? validateStatus(status) : undefined;

  const records = await attendanceRepo.findByWorkDateWithEmployee({
    workDate,
    employeeId,
    status: finalStatus,
  });

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

module.exports = { today };
