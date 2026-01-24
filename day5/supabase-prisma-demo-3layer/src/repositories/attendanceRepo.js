const prisma = require("../db/prisma");

function upsertAttendance({ employeeId, workDate, checkIn, checkOut, status, note }) {
  return prisma.attendance.upsert({
    where: { employeeId_workDate: { employeeId, workDate } },
    update: { checkIn, checkOut, status, note },
    create: { employeeId, workDate, checkIn, checkOut, status, note },
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

module.exports = { upsertAttendance, findByEmployeeAndRange, findToday };
