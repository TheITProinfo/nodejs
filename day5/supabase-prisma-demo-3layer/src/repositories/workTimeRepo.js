const prisma = require("../db/prisma");

function upsertWorkTime({ employeeId, workDate, workMinutes, breakMinutes = 0, otMinutes = 0, ruleVersion, note }) {
  return prisma.workTime.upsert({
    where: { employeeId_workDate: { employeeId, workDate } },
    update: { workMinutes, breakMinutes, otMinutes, ruleVersion, note },
    create: { employeeId, workDate, workMinutes, breakMinutes, otMinutes, ruleVersion, note },
  });
}

function findByEmployeeAndWorkDate({ employeeId, workDate }) {
  return prisma.workTime.findUnique({ where: { employeeId_workDate: { employeeId, workDate } } });
}

module.exports = { upsertWorkTime, findByEmployeeAndWorkDate };
