// const prisma = require("../db/prisma");

// const findByEmployeeNo = (employeeNo) => prisma.employee.findUnique({ where: { employeeNo } });
// const findByEmail = (email) => prisma.employee.findUnique({ where: { email } });
// const createEmployee = (data) => prisma.employee.create({ data });

// module.exports = { findByEmployeeNo, findByEmail, createEmployee };
const prisma = require("../db/prisma");

function findById(id) {
  return prisma.employee.findUnique({ where: { id } });
}

function findByEmployeeNo(employeeNo) {
  return prisma.employee.findUnique({ where: { employeeNo } });
}

function findByEmail(email) {
  return prisma.employee.findUnique({ where: { email } });
}

function createEmployee(data) {
  return prisma.employee.create({ data });
}

function updateEmployee(id, data) {
  return prisma.employee.update({ where: { id }, data });
}

// 软删除：isActive=false（推荐企业做法）
function softDeleteEmployee(id) {
  return prisma.employee.update({ where: { id }, data: { isActive: false } });
}

// 硬删除（可选，谨慎）
function hardDeleteEmployee(id) {
  return prisma.employee.delete({ where: { id } });
}

// 列表 + 搜索 + 分页（可选过滤 isActive）
async function listEmployees({ skip, take, q, isActive }) {
  const where = {
    ...(typeof isActive === "boolean" ? { isActive } : {}),
    ...(q
      ? {
          OR: [
            { employeeNo: { contains: q, mode: "insensitive" } },
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.employee.count({ where }),
  ]);

  return { items, total };
}

module.exports = {
  findById,
  findByEmployeeNo,
  findByEmail,
  createEmployee,
  updateEmployee,
  softDeleteEmployee,
  hardDeleteEmployee,
  listEmployees,
};
