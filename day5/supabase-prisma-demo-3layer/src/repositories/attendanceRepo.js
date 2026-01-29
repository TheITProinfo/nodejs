const prisma = require("../db/prisma");

function upsertAttendance({ employeeId, workDate, checkIn, checkOut, status, note }) {
  return prisma.attendance.upsert({
    where: { employeeId_workDate: { employeeId, workDate } },
    update: {
      // Prisma：undefined 不会更新字段；null 会更新为 null
      ...(checkIn !== undefined ? { checkIn } : {}),
      ...(checkOut !== undefined ? { checkOut } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(note !== undefined ? { note } : {}),
    },
    create: { employeeId, workDate, checkIn, checkOut, status, note },
  });
}

function findByEmployeeAndWorkDate({ employeeId, workDate }) {
  return prisma.attendance.findUnique({
    where: { employeeId_workDate: { employeeId, workDate } },
  });
}

function findByEmployeeAndRange({ employeeId, fromDate, toDate }) {
  return prisma.attendance.findMany({
    where: { employeeId, workDate: { gte: fromDate, lte: toDate } },
    orderBy: { workDate: "asc" },
  });
}

function findToday({ workDate, employeeId }) {
  return prisma.attendance.findMany({
    where: { workDate, ...(employeeId ? { employeeId } : {}) },
    include: {
      employee: { select: { employeeNo: true, firstName: true, lastName: true, email: true, isActive: true } },
    },
    orderBy: [{ status: "asc" }, { employeeId: "asc" }],
  });
}

module.exports = {
  upsertAttendance,
  findByEmployeeAndWorkDate,
  findByEmployeeAndRange,
  findToday,
};
